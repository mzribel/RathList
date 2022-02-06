// --------------------------------------------//
// -- DECLARES VARIABLES & STORAGE FUNCTIONS - // 
// --------------------------------------------//


var display_main = document.getElementById("display_main");
var display_edit = document.getElementById("display_edit");
var display_add = document.getElementById("display_add");
var h1 = document.getElementById("title");
let tasklist = {};
let current_tl = '0';

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
    [ "Things I'd like to learn/master",
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
            console.log(temp);
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
        document.getElementById("p").style.display = 'block';
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

function openEdit() {
    displayEdit();
    if (tasklist[`${current_tl}`].length != 0) {
        // Creates global form and title edit text input.
        var form = document.createElement("form"); form.id = "updateForm"; form.setAttribute('onsubmit', 'editTasklist(event)'); form.setAttribute('method', 'post');
        var titleEdit = document.createElement("input"); titleEdit.type = "text"; titleEdit.classList.add("editText", "title", "big_input_txt");
        titleEdit.value = tasklist[`${current_tl}`][0]; titleEdit.id = 'titleEdit'; titleEdit.name = titleEdit.id;
        // Appends title edit text input to global form.
        form.appendChild(titleEdit);
        // Generates each task edit input.
        for (let i = 1; i < tasklist[`${current_tl}`].length; i++){
            // Creates parent div for each task edit.
            var updateCell = document.createElement("div"); updateCell.classList.add("updateCell"); 

            // Generates individual delete button and appends to parent div.
            var delMark = document.createElement("span"); delMark.innerHTML = "x";
            var delButton = document.createElement("div"); delButton.classList.add("delete_button"); delButton.id = `delButton${i}`;
            delButton.setAttribute('onclick', `deleteTask(${i})`);
            updateCell.appendChild(delButton); delButton.appendChild(delMark); 

            // Creates child div for each task text input.
            var taskCell = document.createElement("div"); taskCell.classList.add("taskCell");

            // Creates checkbox container, checkbox and checkmark.
            var chbx_container = document.createElement("label"); chbx_container.classList.add("chbx_container");
            var checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.classList.add("editCheck"); 
            checkbox.checked = tasklist[`${current_tl}`][i].checked; checkbox.id = `checkEdit_${i}`; checkbox.name = checkbox.id;
            var checkmark = document.createElement("span"); checkmark.classList.add("checkmark");

            // Appends each to child div.
            chbx_container.appendChild(checkbox); chbx_container.appendChild(checkmark); taskCell.appendChild(chbx_container);

            // Creates text input for task name edit.
            var text = document.createElement("input"); text.type = "text"; text.classList.add("editText", "small_input_txt"); 
            text.placeholder="Test"; text.style.width = "100%"; 
            text.value = tasklist[`${current_tl}`][i].name; text.id = `textEdit_${i}`; text.name = text.id;

            // Appends text input to child div, child div to parent div and parent div to form.
            taskCell.appendChild(text); updateCell.appendChild(taskCell); form.appendChild(updateCell);
        }

        // Generates submit button and appends it to form.
        var submit = document.createElement("input"); submit.type = "submit"; 
        submit.id = "updateSubmit"; submit.value = "UPDATE"; 
        form.appendChild(submit); 

        // Appends form to main div.
        display_edit.appendChild(form);
    }
}

// --------------------------------------------//
// ------ ADD / DELETE / EDIT FUNCTIONS ------ // 
// --------------------------------------------//

function editTasklist(event) {
    event.preventDefault();
    let form = event.currentTarget;
    console.log(form);
    if (form['titleEdit'].value != "") {
        tasklist[`${current_tl}`][0] = form['titleEdit'].value;
    }
    for (let i = 1; i < tasklist[`${current_tl}`].length; i++){
        if (form[`textEdit_${i}`].value != "") {
            tasklist[`${current_tl}`][i] = {
                "name": form[`textEdit_${i}`].value,
                "checked": form[`checkEdit_${i}`].checked,
            }
        }
    }
    storageUpdate(tasklist);
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
function deleteTask(task_id) {
    tasklist[`${current_tl}`].splice(task_id, 1);
    storageUpdate(tasklist); countChecked(tasklist[`${current_tl}`], `list_checked_${current_tl}`, `list_${current_tl}`);
    openEdit();
}

function updateCheck(prout) {
    task = document.getElementById(prout);
    id = prout.slice(-1);
    tasklist[`${current_tl}`][id].checked = task.checked;
    console.log(id);
    storageUpdate(tasklist); countChecked(tasklist[`${current_tl}`], `list_checked_${current_tl}`, `list_${current_tl}`);
}


// --------------------------------------------//
// -------- DISPLAYS / HIDE MAIN DIVS -------- // 
// --------------------------------------------//

function displayMain() {
    h1.style.display = "block"
    display_main.style.display = "flex"; display_main.innerHTML = "";
    display_edit.style.display = "none"; display_edit.innerHTML = "";
    display_add.style.display = 'none';
    document.getElementById("add_button").style.display = "flex";
}
function displayEdit() {
    h1.style.display = "none"; h1.innerHTML = "";
    display_main.style.display = 'none';    display_main.innerHTML = "";
    display_edit.style.display = "flex"; display_edit.innerHTML = "";
    document.getElementById("add_button").style.display = "none";
    display_add.style.display = "none";
    document.getElementById("emptylist").style.display = 'none';
}
function displaySwitch() {
    if (display_main.style.display == "flex") {
        openEdit();
    } else if (display_edit.style.display == "flex") {
        displayChecklist();
    }
}
function Display_Hide_List() {
    document.getElementById("changeList").innerHTML = "";
    if (document.getElementById("changeList").style.display == 'none') {
        document.getElementById("changeList").style.display = "block";
        changeList();
    }
    else {
        document.getElementById("changeList").style.display = "none";
    }
}
function Display_Hide_Links() {
    if (document.getElementById("links").style.display == 'none') {
        document.getElementById("links").style.display = 'block';
    } else {
        document.getElementById("links").style.display = 'none';
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
    document.getElementById('changeList').innerHTML = "";
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
            document.getElementById('changeList').append(parent_element);
            // Generates count check.
            countChecked(tasklist[i], `list_checked_${i}`, `list_${i}`);
        }
    }
}

function countChecked(tasklist_id, child_div, parent_div) {
    console.log(tasklist_id, child_div, parent_div);
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