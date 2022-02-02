var display_main = document.getElementById("display_main");
var display_edit = document.getElementById("display_edit");
var display_add = document.getElementById("display_add");
var h1 = document.getElementById("title");
let tasklist = {};
let current_tl = "";

function storageUpdate(element) {
    localStorage.setItem('tasklist', JSON.stringify(element));
}
function currentUpdate() {
    localStorage.setItem('current_tl', JSON.stringify(current_tl));
}
function storageInit() {
    if (localStorage.length == 0) {
        let temp = [
            [
                "List 1:",
                {
                    "name":"Task 1",
                    "checked":false,
                },
                {
                    "name":"Task 2",
                    "checked":true,
                }
            ]
            // [ "List 2:",
            //     {
            //         "name":"Task 1",
            //         "checked":false,
            //     },
            //     {
            //         "name":"Task 2",
            //         "checked":true,
            //     }
            // ]
        ]; 
            console.log(temp);
            storageUpdate(temp);
            current_tl = 0; currentUpdate();
    }
    tasklist = convertToObject('tasklist');
}
function convertToObject(storedObj) {
    var storedObj = localStorage.getItem(storedObj);
    var localObj = JSON.parse(storedObj);
    return localObj;
}

function displayChecklist() {
    displayMain();
    if (tasklist.length == 0) {
    h1.innerHTML = "Nothing to see here!";
    } else if (tasklist[0].length == 1) {
        h1.innerHTML = tasklist[0][0];
        document.getElementById("p").style.display = 'block';
        document.getElementById("p").innerHTML = "zebi";

    } else {
        h1.innerHTML = tasklist[0][0];
        for (let i = 1; i < tasklist[0].length; i++){
            display_main.classList.add("demo");
            var list = document.createElement("div");
            var elem = document.createElement("input");
            elem.type = "checkbox";
            elem.id = `check_${i}`;
            elem.name = tasklist[0][i].name;
            elem.setAttribute('onclick', `updateCheck('check_${i}')`);
            elem.checked = tasklist[0][i].checked;
            var label = document.createElement("label");
            label.for = elem.name;
            label.classList.add('chbx_container');
            label.innerHTML = elem.name;
            var span = document.createElement("span");
            span.classList.add("chbx_checkmark");
            label.appendChild(elem);
            label.appendChild(span);
            list.appendChild(label);
            display_main.appendChild(list);
        }
    }
}

function updateCheck(prout) {
    elem = document.getElementById(prout);
    number = prout.slice(-1);
    tasklist[0][number].checked = elem.checked;
    localStorage.clear();
    localStorage.setItem('tasklist', JSON.stringify(tasklist));
}



function openEdit() {
    display_edit.innerHTML = "";
    console.log("coucou");
    if (tasklist[0].length != 0) {
        h1.innerHTML = "";
        var form = document.createElement("form"); form.id = "updateForm"; form.setAttribute('onsubmit', 'editTasklist(event)'); form.setAttribute('method', 'post');
        var titleEdit = document.createElement("input"); titleEdit.type = "text"; titleEdit.classList.add("editText", "title", "big_input_txt");
        titleEdit.value = tasklist[0][0]; titleEdit.id = 'titleEdit'; titleEdit.name = titleEdit.id;
        form.appendChild(titleEdit);
        for (let i = 1; i < tasklist[0].length; i++){
            var uCell = document.createElement("div"); uCell.classList.add("updateCell");
            var delSpan = document.createElement("span"); delSpan.innerHTML = "x";
            var delButton = document.createElement("div"); delButton.classList.add("deleteButton"); delButton.id = `delButton${i}`;
            delButton.setAttribute('onclick', `deleteTask(${i})`);
            delButton.appendChild(delSpan); uCell.appendChild(delButton);
            var tCell = document.createElement("div"); tCell.classList.add("taskCell");
            var checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.classList.add("editCheck"); 
            checkbox.checked = tasklist[0][i].checked; checkbox.id = `checkEdit_${i}`; checkbox.name = checkbox.id;
            var checkSpan = document.createElement("span"); checkSpan.classList.add("chbx_checkmark");
            var label = document.createElement("label"); label.classList.add("chbx_container");
            label.appendChild(checkbox); label.appendChild(checkSpan); tCell.appendChild(label);
            var text = document.createElement("input"); text.type = "text"; text.classList.add("editText", "small_input_txt"); 
            text.placeholder="Test"; text.style.width = "100%"; 
            text.value = tasklist[0][i].name; text.id = `textEdit_${i}`; text.name = text.id;
            tCell.appendChild(text);
        
            uCell.appendChild(tCell); 
            form.appendChild(uCell);
        }
        var submit = document.createElement("input"); submit.type = "submit"; 
        submit.id = "updateSubmit"; submit.value = "UPDATE"; 
        form.appendChild(submit); 
        display_edit.appendChild(form);
    }
}

function editTasklist(event) {
    event.preventDefault();
    let form = event.currentTarget;
    console.log(form);
    if (form['titleEdit'].value != "") {
        tasklist[0][0] = form['titleEdit'].value;
    }
    for (let i = 1; i < tasklist[0].length; i++){
        if (form[`textEdit_${i}`].value != "") {
            tasklist[0][i] = {
                "name": form[`textEdit_${i}`].value,
                "checked": form[`checkEdit_${i}`].checked,
            }
        }
    }
    localStorage.clear();
    localStorage.setItem('tasklist', JSON.stringify(tasklist));
    console.log(display_main);
    displayMain(); displayChecklist();

}

function addTask(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let length = tasklist[0].length;
    if (form.addInput.value !== "") {
        tasklist[0][length] = {
            "name": form.addInput.value,
            "checked": form.addChecked.checked,
        }
        storageUpdate(tasklist);
        document.getElementById("addInput").value = "";
        displayChecklist(); displayAdd();
    }
}

function deleteTask(task_id) {
    tasklist[0].splice(task_id, 1);
    storageUpdate(tasklist);
    displayEdit(); openEdit();
}

function displayMain() {
    h1.style.display = "block"
    display_main.style.display = "flex"; display_main.innerHTML = "";
    display_edit.style.display = "none"; display_edit.innerHTML = "";
    display_add.style.display = 'none';
    document.getElementById("button_add").style.display = "flex";
}
function displayEdit() {
    h1.style.display = "none"; h1.innerHTML = "";
    display_main.style.display = 'none';    display_main.innerHTML = "";
    display_edit.style.display = "flex"; display_edit.innerHTML = "";
    document.getElementById("button_add").style.display = "none";
    display_add.style.display = "none";
    document.getElementById("p").style.display = 'none';
}
function displaySwitch() {
    if (display_main.style.display == "flex") {
        displayEdit(); openEdit();
    } else if (display_edit.style.display == "flex") {
        displayMain(); displayChecklist();
    }
}
function displayAdd() {
    if (display_add.style.display == 'none') {
        display_add.style.display = 'block';
        document.getElementById("p").style.display = 'none';

    }
    else {
        displayMain(); displayChecklist();
    }
}