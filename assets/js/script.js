// --------------------------------------------//
// -- DECLARES VARIABLES & STORAGE FUNCTIONS - // 
// --------------------------------------------//


var display_main = document.getElementById("display_main");
var display_edit = document.getElementById("display_edit");
var display_add = document.getElementById("display_add");
var h1 = document.getElementById("title");
let tasklist = {};
let current_tl = '0';
let id_number = 0;

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
    tasklist = convertToObject('tasklist');
    current_tl = `${convertToObject('current_tl')}`;
}
function storageUpdate(element) {
    localStorage.setItem('tasklist', JSON.stringify(element));
}
function currentUpdate() {
    localStorage.setItem('current_tl', JSON.stringify(current_tl));
}

function convertToObject(storedObj) {
    var storedObj = localStorage.getItem(storedObj);
    var localObj = JSON.parse(storedObj);
    return localObj;
}

// --------------------------------------------//
// ------- OPEN / CLOSE DISPLAY & EDIT-------- // 
// --------------------------------------------//

function displayChecklist() {
    displayMain();
    // No tasklist at all.
    if (tasklist.length == 0) {
    h1.innerHTML = "Nothing to see here!";
    // Selected tasklist is empty.
    } else if (tasklist[`${current_tl}`].length == 1) {
        h1.innerHTML = tasklist[`${current_tl}`][0];
        document.getElementById("emptylist").style.display = 'block';
    // Generate tasks of selected tasklist.
    } else {
        let checked_nb = 0;
        h1.innerHTML = tasklist[`${current_tl}`][0];
        for (let i = 1; i < tasklist[`${current_tl}`].length; i++){
            // Creates parent div for each task.
            var list = document.createElement("div");
            // Creates input + attributes.
            var task = document.createElement("input");
            task.type = "checkbox";
            task.id = `check_${i}`;
            task.name = tasklist[`${current_tl}`][i].name;
            task.setAttribute('onclick', `updateCheck('check_${i}')`);
            task.checked = tasklist[`${current_tl}`][i].checked;
            // Creates checkbox container + attributes.
            var chbx_container = document.createElement("label");
            chbx_container.for = task.name;
            chbx_container.classList.add('chbx_container');
            chbx_container.innerHTML = task.name;
            // Creates checkmark for checkbox.
            var checkmark = document.createElement("span");
            // Appends all elements to each other and to main div, display_main.
            checkmark.classList.add("checkmark");
            chbx_container.appendChild(task);
            chbx_container.appendChild(checkmark);
            list.appendChild(chbx_container);
            display_main.appendChild(list);
        }
    }
}

function generateAddForm(parent_div, list="") {
    // Creates parent div for each task edit.
    var updateCell = document.createElement("div"); updateCell.classList.add("updateCell"); updateCell.id = `updateCell_${id_number}`;

    // Generates individual delete button and appends to parent div.
    var delMark = document.createElement("span"); delMark.innerHTML = "x";
    var delButton = document.createElement("div"); delButton.classList.add("delete_button"); delButton.id = `delButton${id_number}`;
    delButton.setAttribute('onclick', `deleteTask(${id_number})`);
    updateCell.appendChild(delButton); delButton.appendChild(delMark); 
    
    // BUTTONS TO CHANGE
    var order = document.createElement("div"); order.classList.add("order");
    var plus = document.createElement("a"); plus.innerHTML = "+"; plus.setAttribute("onclick", `invertValues(${id_number}, 'up')`);
    var moins = document.createElement("a"); moins.innerHTML = "-"; moins.setAttribute("onclick", `invertValues(${id_number}, 'down')`);
    order.appendChild(plus); order.appendChild(moins); 
    
    // Creates child div for each task text input.
    var taskCell = document.createElement("div"); taskCell.classList.add("taskCell");

    // Creates checkbox container, checkbox and checkmark.
    var chbx_container = document.createElement("label"); chbx_container.classList.add("chbx_container");
    var checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.classList.add("check"); 
    checkbox.id = `checkEdit_${id_number}`; checkbox.name = checkbox.id;
    var checkmark = document.createElement("span"); checkmark.classList.add("checkmark");
    
    // Appends each to child div.
    chbx_container.appendChild(checkbox); chbx_container.appendChild(checkmark); taskCell.appendChild(chbx_container);

    // Creates text input for task name edit.
    var text = document.createElement("input"); text.type = "text"; text.classList.add("editText", "small_input_txt", "pouet"); 
    text.placeholder="Test"; text.style.width = "100%"; 
    text.id = `textEdit_${id_number}`; text.name = text.id;

    if (list !== "") {
        text.value = list.name; checkbox.checked = list.checked;
    } else {
        text.value = ""; checkbox.checked = false;
    }

    // Appends text input to child div, child div to parent div and parent div to form.
    taskCell.appendChild(text); taskCell.appendChild(order); updateCell.appendChild(taskCell); 
    document.getElementById(parent_div).appendChild(updateCell);

    id_number++;
}


function openEdit(list="") {
    console.log(list);
    displayEdit();
    id_number = 0; let temp = [];

    // Creates global form and title edit text input.
    var form = document.createElement("form"); form.id = "updateForm"; form.setAttribute('method', 'post');
    var titleEdit = document.createElement("input"); titleEdit.type = "text"; titleEdit.classList.add("editText", "title", "big_input_txt");
    titleEdit.id = 'titleEdit'; titleEdit.name = titleEdit.id;
    
    // Appends form to main div.
    display_edit.appendChild(form);
    var subtitle = document.createElement("div"); subtitle.classList.add("subtitle");
    var a = document.createElement("a"); a.setAttribute("onclick", `generateAddForm("container")`); a.innerHTML = "Add a task."; 
    var b = document.createElement("a"); b.setAttribute("onclick", `deleteTasklist(${current_tl})`); b.innerHTML = "Delete tasklist."; 

    subtitle.appendChild(a); subtitle.appendChild(b);
    form.appendChild(titleEdit); form.appendChild(subtitle);
    
    var container = document.createElement("div"); container.id = "container"; form.appendChild(container);

    if (list !== "") {
        temp = [...list]; title = temp.shift(); titleEdit.value = title;
        form.setAttribute('onsubmit', `editTasklist(event, tasklist[${current_tl}])`); 
        if (temp.length == 0) {
            generateAddForm("container");
        } else {
            // Generates each task edit input.
            for (task of temp) {
                // Creates parent div for each task edit.
                generateAddForm("container", task)
            }
        }    
    } else {
        form.setAttribute('onsubmit', `editTasklist(event)`); 
        title = "New list"; titleEdit.value = title;
        for (let i = 0; i < 5; i++) {
            generateAddForm("container");
        }
    }
    var submit = document.createElement("input"); submit.type = "submit"; 
    submit.id = "updateSubmit"; submit.value = "UPDATE"; 
    form.appendChild(submit);
}


// --------------------------------------------//
// ------ ADD / DELETE / EDIT FUNCTIONS ------ // 
// --------------------------------------------//

function editTasklist(event, list="") {
    console.log(list);
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
        tasklist.push(temp_list); storageUpdate(tasklist);
        current_tl = tasklist.indexOf(temp_list); currentUpdate();
    } else {
        tasklist[`${current_tl}`] = temp_list; storageUpdate(tasklist);
    }
    displayMain(); displayChecklist(); changeList();
}


function addTask(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let length = tasklist[`${current_tl}`].length;
    if (form.addform_txt.value !== "") {
        tasklist[`${current_tl}`][length] = {
            "name": form.addform_txt.value,
            "checked": form.addform_checked.checked,
        }
        storageUpdate(tasklist); countChecked(tasklist[`${current_tl}`], `list_checked_${current_tl}`, `list_${current_tl}`);
        document.getElementById("addform_txt").value = "";
        displayChecklist(); displayAdd();
    }
}
function deleteTask(id) {
    let container = document.getElementById(`updateCell_${id}`); 
    container.remove();
}
function deleteTasklist(id) {
    console.log(id);
    tasklist.splice(id, 1); storageUpdate(tasklist);
    if (id == current_tl) {
        current_tl = 0; currentUpdate();
    }
    displayChecklist(); changeList();
}

function updateCheck(prout) {
    task = document.getElementById(prout);
    id = prout.slice(-1);
    tasklist[`${current_tl}`][id].checked = task.checked;
    storageUpdate(tasklist); countChecked(tasklist[`${current_tl}`], `list_checked_${current_tl}`, `list_${current_tl}`);
}



// --------------------------------------------//
// -------- DISPLAYS / HIDE MAIN DIVS -------- // 
// --------------------------------------------//

function displayMain() {
    h1.style.display = "block";
    document.getElementById('order_by').style.display = "block";
    display_main.style.display = "flex"; display_main.innerHTML = "";
    display_edit.style.display = "none"; display_edit.innerHTML = "";
    display_add.style.display = 'none';
    document.getElementById("add_button").style.display = "flex";
}
function displayEdit() {
    h1.style.display = "none"; h1.innerHTML = "";
    document.getElementById('order_by').style.display = "none";
    display_main.style.display = 'none';    display_main.innerHTML = "";
    display_edit.style.display = "flex"; display_edit.innerHTML = "";
    document.getElementById("add_button").style.display = "none";
    display_add.style.display = "none";
    document.getElementById("emptylist").style.display = 'none';
}
function displaySwitch() {
    if (display_main.style.display == "flex") {
        openEdit(tasklist[`${current_tl}`]);
    } else if (display_edit.style.display == "flex") {
        displayChecklist();
    }
}
function Display_Hide_List() {
    document.getElementById("side_bar_tasklists").innerHTML = "";
    if (document.getElementById("side_bar_tasklists").style.display == 'none') {
        document.getElementById("side_bar_tasklists").style.display = "block";
        changeList();
    }
    else {
        document.getElementById("side_bar_tasklists").style.display = "none";
    }
}
function Display_Hide_Links() {
    if (document.getElementById("socials").style.display == 'none') {
        document.getElementById("socials").style.display = 'block';
    } else {
        document.getElementById("socials").style.display = 'none';
    }
}

function displayAdd() {
    if (display_add.style.display == 'none') {
        display_add.style.display = 'block';
        document.getElementById("emptylist").style.display = 'none';

    }
    else {
        displayChecklist();
    }
}

// --------------------------------------------//
// ---------- TASKLISTS ON LEFT BAR ---------- // 
// --------------------------------------------//

function changeList() {
    document.getElementById('side_bar_tasklists').innerHTML = "";
    if (tasklist.length != 0) {
        for (let i = 0; i < tasklist.length; i++) {
            // Creates parent div to both list name and check count.
            var parent_element = document.createElement("div"); parent_element.id = `list_${i}`;
            parent_element.classList.add("lists");
            // Generates list names.
            var list_name = document.createElement("div"); list_name.id=`list_id${i}`; 
            list_name.setAttribute('onclick', `changeCurrent(${i})`);
            list_name.classList.add("list_ids");
            list_name.innerHTML = tasklist[i][0];
            // Appends elements.
            parent_element.appendChild(list_name);
            document.getElementById('side_bar_tasklists').append(parent_element);
            // Generates count check.
            countChecked(tasklist[i], `list_checked_${i}`, `list_${i}`);
        }
    }
    
    var add_new = document.createElement("div"); add_new.classList.add("add_new");
    add_new.setAttribute('onclick', 'openEdit()'); add_new.innerHTML = "Add a new tasklist..."
    document.getElementById('side_bar_tasklists').appendChild(add_new);

    var see_all = document.createElement("div"); see_all.classList.add("see_all");
    see_all.setAttribute('onclick', ''); see_all.innerHTML = "See all tasklists..."
    document.getElementById('side_bar_tasklists').appendChild(see_all);

}

function countChecked(tasklist_id, child_div, parent_div) {
    let count_checked = 0;
    for (let j = 1; j < tasklist_id.length; j++) {
        if (tasklist_id[j].checked) {
            count_checked++;
        }
    }
    if (document.getElementById(child_div) == null) {
        var list_checked = document.createElement("div"); list_checked.id = child_div;
        list_checked.innerHTML = `(${count_checked}/${(tasklist_id.length -1)})`; list_checked.classList.add("list_checks");
        document.getElementById(parent_div).appendChild(list_checked);
    } else {
        var list_checked = document.getElementById(child_div);
        list_checked.innerHTML = `(${count_checked}/${(tasklist_id.length -1)})`; list_checked.classList.add("list_checks");
    }
} 

function changeCurrent(id) {
    current_tl = `${id}`;
    currentUpdate();
    displayChecklist();

}

// TESTING JSON DOWNLOAD

function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function onDownload() {
    download(JSON.stringify(tasklist), "tasklist.json", "text/plain");
}


// _____________________________________________________________________

function orderBy(list=tasklist[`${current_tl}`], value="checked", order="desc") {
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
    storageUpdate(tasklist); displayChecklist();
    return list;
}


function invertValues(id, direction) {
    if (direction == "up" && id > 1) {
        let temp_checked = document.getElementById(`checkEdit_${id}`).checked;
        let temp_value = document.getElementById(`textEdit_${id}`).value;

        document.getElementById(`checkEdit_${id}`).checked = document.getElementById(`checkEdit_${id - 1}`).checked;
        document.getElementById(`textEdit_${id}`).value = document.getElementById(`textEdit_${id - 1}`).value;
        
        document.getElementById(`checkEdit_${id - 1}`).checked = temp_checked;
        document.getElementById(`textEdit_${id - 1}`).value = temp_value;
    } else if (direction =="down" && id < (tasklist[`${current_tl}`].length - 1)) {
        let temp_checked = document.getElementById(`checkEdit_${id}`).checked;
        let temp_value = document.getElementById(`textEdit_${id}`).value;

        document.getElementById(`checkEdit_${id}`).checked = document.getElementById(`checkEdit_${id + 1}`).checked;
        document.getElementById(`textEdit_${id}`).value = document.getElementById(`textEdit_${id + 1}`).value;
        
        document.getElementById(`checkEdit_${id + 1}`).checked = temp_checked;
        document.getElementById(`textEdit_${id + 1}`).value = temp_value;
    }
}