// --------------------------------------------//
// -- DECLARES VARIABLES & STORAGE FUNCTIONS - // 
// --------------------------------------------//

var add_button = document.getElementById("add_button");
var addForm = `
        <form id="addForm" action="" method="post" onsubmit="addTask(event)" style="display:none;">
            <div style="display: flex;">
                <label class="chbx_container">
                    <input type="checkbox" id="addform_checked" name="addform_checked">
                    <span class="checkmark"></span>                            
                </label>                                
                <input type="text" id="addform_txt" name="addform_txt" class="addform_txt small_input_txt" placeholder="Add a new task here" value="">
            </div>
            <input type="submit" id="addform_submit" value="Add Task:">
        </form>
`;
var main_content = document.getElementById("main_content");
let tasklists = {}; let current_tl = '0'; let id_number = 0;

let temp = [
    [
        "Improving RathList!", 
        {
            "name":"Dynamic and editable tasklists",
            "checked":true,
        },
        {
            "name":"Local Storage",
            "checked":true,
        },
        {
            "name":"Color themes",
            "checked":false,
        },
        {
            "name":"Responsive design",
            "checked":false,
        },
        {
            "name":"Import/export of JSON files.",
            "checked":false,
        },

    ],
    [ 
        "Things I'd like to learn/master",
        {
            "name":"C",
            "checked":true,
        },
        {
            "name":"C++",
            "checked":false,
        },
        {
            "name":"Python",
            "checked":true,
        },
        {
            "name":"HTML/CSS",
            "checked":true,
        },
        {
            "name":"Javascript",
            "checked":true,
        },
        {
            "name":"JS frameworks",
            "checked":false,
        }
    ]
]; 

function storageInit() {
    if (localStorage.length == 0) {
            storageUpdate(temp);
            current_tl = 1; currentUpdate();
    }
    tasklists = convertToObject('tasklists');
    current_tl = `${convertToObject('current_tl')}`;
};
function storageUpdate(element) {
    localStorage.setItem('tasklists', JSON.stringify(element));
};
function currentUpdate() {
    localStorage.setItem('current_tl', JSON.stringify(current_tl));
};
function convertToObject(storedObj) {
    var storedObj = localStorage.getItem(storedObj);
    var localObj = JSON.parse(storedObj);
    return localObj;
};

// --------------------------------------------//
// -------------- DISPLAY MODE---------------- // 
// --------------------------------------------//

function displayList_Template(addform="", list=tasklists[`${current_tl}`]) {
    add_button.style.display = "flex";
    main_content.innerHTML = `<h1 id="title" class="title">${tasklists.length == 0 ? 'Nothing to see here!' : list[0]}</h1>
    `; let temp = template = "";

    if (tasklists.length == 0) {
        add_button.setAttribute("onclick","displayEdit_Template()")
    } else {
        var displayList_container = document.createElement("div"); displayList_container.classList.add("displayList_container")
        add_button.setAttribute("onclick","addForm_Template()");
        if (list.length == 1) {
            main_content.innerHTML += `<p id="emptylist" style="display: block;"><img src="assets/img/help.png" alt=""></p>`;
            main_content.appendChild(displayList_container);
        } else {
            main_content.innerHTML += `<div id="order_by" class="subtitle">Order by: 
            <a onclick=''>default</a> ---
            <a onclick='orderBy(tasklists[${current_tl}], "checked", "desc")'>to do</a> ---
            <a onclick='orderBy(tasklists[${current_tl}], "checked", "asc")'>done</a> ---
            <a onclick='orderBy(tasklists[${current_tl}], "name", "asc")'>alphabetical</a> --- 
            <a onclick='orderBy(tasklists[${current_tl}], "name", "desc")'>anti-alphabetical</a>.</div>
            `; main_content.appendChild(displayList_container);
            for (let i = 1; i < list.length; i++){
                temp = `
                <div>
                    <label class="chbx_container">${list[i].name}
                        <input type="checkbox" id="check_${i}" name="${list[i].name}" onclick="updateCheck('check_${i}')" ${list[i].checked ? "checked" : ""}>
                        <span class="checkmark"></span>
                    </label>
                </div>
                `;
                template = template.concat('', temp);    
            }
        }
        template = template.concat('', addForm);
        displayList_container.innerHTML = template;
        document.getElementById("addForm").style.display = addform == "" ? "none" : "flex";
    }
};

function orderBy(list=tasklists[`${current_tl}`], value="checked", order="desc") {
    temp = list;
    title = temp.shift();
    
    // Sort key = check.
    if (value == "checked") {
        temp.sort(function(a, b) {
            if (a[value] == true && b[value] == false) {
                if (order == "asc") {
                    return -1;
                } else {
                    return 1;
                }
            } else if (a[value] == false && b[value] == true) {
                if (order == "asc") {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                // return 0;
                return a.name.localeCompare(b.name);
            }
        });
    }

    // Sort key = alphabetical.
    if (value == "name") {
        temp.sort(function(a, b) {
            if (order == "asc") {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
    }
    temp.unshift(title); list = temp;
    storageUpdate(tasklists); displayList_Template();
    return list;
};

function addForm_Template() {
    if (document.getElementById("addForm") != null) {
        let addForm = document.getElementById("addForm");
        addForm.style.display = addForm.style.display == "none" ? "block" : "none";
        if (document.getElementById("emptylist") != null) {
            document.getElementById("emptylist").style.display = addForm.style.display == "none" ? "block" : "none";
        }
    }
};
function addTask(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let length = tasklists[`${current_tl}`].length;
    if (form.addform_txt.value !== "") {
        tasklists[`${current_tl}`][length] = {
            "name": form.addform_txt.value,
            "checked": form.addform_checked.checked,
        }
        storageUpdate(tasklists); countChecked(tasklists[`${current_tl}`], `list_checked_${current_tl}`, `list_${current_tl}`);
        document.getElementById("addform_txt").value = "";

        refreshSideList(); displayList_Template("prout"); 
    }
};

// --------------------------------------------//
// --------------- EDIT MODE------------------ // 
// --------------------------------------------//

function displayEdit_Template(list='') {

    add_button.style.display = "none"; add_button.removeAttribute("onclick");
    document.getElementById("addForm") != null ? document.getElementById("addForm").remove() : {};
    

    main_content.innerHTML = `
    <form id="editForm" method="post" onsubmit='${list != '' ? `editTasklist(event, tasklists[${current_tl}])` : `editTasklist(event)`}'>
        <input type='text' class='editText title big_input_txt' id='titleEdit' name='titleEdit' value="${list != '' ? list[0] : 'New List'}">
        <div class="subtitle" style="margin-left: 10px;">
            <a onclick='editForm_Template("displayEdit_container")'>Add a task</a> 
            ${list != 0 ? ` --- <a id='dl'>Delete tasklist.</a>` : ``}
        </div>
        <div id="displayEdit_container"></div>
        <input type="submit" id="editSubmit" value="UPDATE">
    </form>
    `; 

    id_number = 0; let tasks = [];

    if (list != "") {
        document.getElementById("dl").setAttribute("onclick", `deleteTasklist(${current_tl})`);
        tasks = [...list]; title = tasks.shift(); 
        if (tasks.length == 0) {
            editForm_Template("displayEdit_container");
        } else {
            // Generates each task edit input.
            for (element of tasks) {
                // Creates parent div for each task edit.
                editForm_Template("displayEdit_container", element)
            }
        }    
    } else {
        for (let i = 0; i < 5; i++) {
            editForm_Template("displayEdit_container");
        }
    }
};

function invertValues(id, direction) {
    if (direction == "up" && id > 1) {
        let temp_checked = document.getElementById(`checkEdit_${id}`).checked;
        let temp_value = document.getElementById(`textEdit_${id}`).value;

        document.getElementById(`checkEdit_${id}`).checked = document.getElementById(`checkEdit_${id - 1}`).checked;
        document.getElementById(`textEdit_${id}`).value = document.getElementById(`textEdit_${id - 1}`).value;
        
        document.getElementById(`checkEdit_${id - 1}`).checked = temp_checked;
        document.getElementById(`textEdit_${id - 1}`).value = temp_value;
    } else if (direction =="down" && id < (tasklists[`${current_tl}`].length - 1)) {
        let temp_checked = document.getElementById(`checkEdit_${id}`).checked;
        let temp_value = document.getElementById(`textEdit_${id}`).value;

        document.getElementById(`checkEdit_${id}`).checked = document.getElementById(`checkEdit_${id + 1}`).checked;
        document.getElementById(`textEdit_${id}`).value = document.getElementById(`textEdit_${id + 1}`).value;
        
        document.getElementById(`checkEdit_${id + 1}`).checked = temp_checked;
        document.getElementById(`textEdit_${id + 1}`).value = temp_value;
    }
};

function editForm_Template(parent_div, task="") {
    var updateCell = document.createElement("div"); updateCell.classList.add("updateCell"); updateCell.id = `updateCell_${id_number}`;
    let template = `
    <div class="delete_button" id="delButton${id_number}" onclick="deleteTask(${id_number})">
        <span>x</span>
    </div>
    <div class="taskCell">
        <label class="chbx_container">
            <input type="checkbox" class="check" id='checkEdit_${id_number}' name='checkEdit_${id_number}' ${task != '' && task.checked == true ? 'checked' : ''}>
            <span class="checkmark"></span>
        </label>
        <input type="text" class="editText small_input_txt pouet" placeholder="Test" id="textEdit_${id_number}" name="textEdit_${id_number}" value="${task != "" ? task.name : ""}" style="width: 100%;">
        <div class="order">
            <a onclick="invertValues(${id_number}, 'up')">+</a>
            <a onclick="invertValues(${id_number}, 'down')">-</a>
        </div>
    </div>
    `; updateCell.innerHTML = template;

    // Appends text input to child div, child div to parent div and parent div to form.
    document.getElementById(parent_div).appendChild(updateCell);

    id_number++;
};
function editTasklist(event, list="") {
    event.preventDefault();
    let form = event.currentTarget;
    let temp_list = [];
    if (form['titleEdit'].value == "") {
        temp_list[0] = list[0];
    } else {
        temp_list[0] = form['titleEdit'].value;
    }

    let form_tasks = form.getElementsByClassName("pouet");
    for (task of form_tasks) {
        if (task.value != "") {
            id = task.id.slice(-1);

            let temp = {};
            temp["name"] = form[`textEdit_${id}`].value;
            temp["checked"] = form[`checkEdit_${id}`].checked;
            temp_list.push(temp);
        }
    }
    if (list == "") {
        tasklists.push(temp_list); storageUpdate(tasklists);
        current_tl = tasklists.indexOf(temp_list); currentUpdate();
    } else {
        tasklists[`${current_tl}`] = temp_list; storageUpdate(tasklists);
    }
    refreshSideList(); switchDisplay();
};
function deleteTask(id) {
    let container = document.getElementById(`updateCell_${id}`); 
    container.remove();
};

function deleteTasklist(id) {
    tasklists.splice(id, 1); storageUpdate(tasklists);
    if (id == current_tl) {
        current_tl = 0; currentUpdate();
    }
    refreshSideList(); switchDisplay();
};

// --------------------------------------------//
// --------------- SIDE LIST------------------ // 
// --------------------------------------------//

// Opens and closes side menus.
function switchSideList(element) {
    element = document.getElementById(element); refreshSideList();
    element.classList.toggle("visible");

    element.style.display = element.classList.contains("visible") ? "block" : "none";
};

// Refreshes tasklists and completion of lists.
function refreshSideList() {
    document.getElementById('lists').innerHTML = "";
    if (tasklists.length != 0) {
        for (let i = 0; i < tasklists.length; i++) {
            temp = `
            <div id="list_${i}" class="lists">
                <div id="list_id${i}" onclick="refreshCurrent(${i})" class="list_ids">${tasklists[i][0]}</div>
                <div id="list_checked_${i}" class="list_checks">${countChecked(tasklists[i], `list_checked_${i}`, `list_${i}`)}</div>
            </div>
            `;
            document.getElementById('lists').innerHTML += temp;
        }
    }
};

// --------------------------------------------//
// ------------ OTHER FUNCTIONS -------------- // 
// --------------------------------------------//

// Refreshes checked status when clicking on a checkbox.
function updateCheck(check_id) {
    task = document.getElementById(check_id);
    id = check_id.replace(/\D/g, '');
    tasklists[`${current_tl}`][id].checked = task.checked;
    storageUpdate(tasklists); countChecked(tasklists[`${current_tl}`], `list_checked_${current_tl}`, `list_${current_tl}`);
    refreshSideList();
};

// Switches between display and edit mode.
function switchDisplay() {
    main_content.classList.contains("displayMode") ? main_content.classList.replace("displayMode", "editMode") && displayEdit_Template(tasklists[`${current_tl}`])
    : main_content.classList.contains("editMode") ? main_content.classList.replace("editMode", "displayMode") && displayList_Template()
    : {};
};

// Returns the nb of completed tasks.
function countChecked(tasklist_id) {
    let count_checked = 0;
    for (let i = 1; i < tasklist_id.length; i++) {
        if (tasklist_id[i].checked) {
            count_checked++;
        }
    }
    return `(${count_checked}/${(tasklist_id.length -1)})`;
};

// Refreshes current id after the addition of a new tasklist.
function refreshCurrent(id) {
    current_tl = `${id}`;
    currentUpdate();
    displayList_Template();
};
