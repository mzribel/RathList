let tasks = {};

function storageInit() {
    if (localStorage.length == 0) {
        let temp = [
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
        localStorage.setItem('tasklist_1', JSON.stringify(temp));
    }
    tasks = convertToObject('tasklist_1');
}

function convertToObject(localObj) {
    var toRetrieve = localStorage.getItem(localObj);
    var retrieved = JSON.parse(toRetrieve);
    return retrieved;
}

function displayChecklist() {
  if (Object.keys(tasks).length == 0) {
    document.getElementById("title").innerHTML = "Nothing to see here!";
  } else {
      document.getElementById("title").innerHTML = tasks[0];
      for (let i = 1; i < (Object.keys(tasks).length); i++){
          document.getElementById("demo").classList.add("demo");
          var list = document.createElement("div");
          var elem = document.createElement("input");
          elem.type = "checkbox";
          elem.id = i;
          elem.name = tasks[i].name;
          elem.checked = tasks[i].checked;
          var label = document.createElement("label");
          label.for = elem.name;
          label.classList.add('chbx_container');
          label.innerHTML = elem.name;
          var span = document.createElement("span");
          span.classList.add("chbx_checkmark");
          label.appendChild(elem);
          label.appendChild(span);
          list.appendChild(label);
          document.getElementById("demo").appendChild(list);
      }
  }
}

function openEdit() {
    if (Object.keys(tasks).length != 0) {
        document.getElementById("title").innerHTML = tasks[0];
        document.getElementById("demo").innerHTML = "";
        document.getElementById("demo").classList.remove("demo");
        document.getElementById("demo").classList.add("updateContainer");
        var form = document.createElement("form"); form.id = "updateForm"; form.onsubmit="";
        for (let i = 1; i < (Object.keys(tasks).length); i++){
            var uCell = document.createElement("div"); uCell.classList.add("updateCell");
            var delSpan = document.createElement("span"); delSpan.innerHTML = "x";
            var delButton = document.createElement("div"); delButton.classList.add("deleteButton"); delButton.id = `delButton${i}`;
            delButton.setAttribute('onclick', `deleteTask(${i})`);
            delButton.appendChild(delSpan); uCell.appendChild(delButton);
            var tCell = document.createElement("div"); tCell.classList.add("taskCell");
            var checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.classList.add("editCheck"); 
            checkbox.checked = tasks[i].checked; checkbox.id = `checkEdit_${i}`; checkbox.name = checkbox.id;
            var checkSpan = document.createElement("span"); checkSpan.classList.add("chbx_checkmark");
            var label = document.createElement("label"); label.classList.add("chbx_container");

            label.appendChild(checkbox); label.appendChild(checkSpan); tCell.appendChild(label);
            var text = document.createElement("input"); text.type = "text"; text.classList.add("editText"); 
            text.placeholder="Test"; text.style.width = "100%"; 
            text.value = tasks[i].name; text.id = `textEdit_${i}`; text.name = text.id;
            tCell.appendChild(text);
        
            uCell.appendChild(tCell); 
            form.appendChild(uCell);
        }
        var submit = document.createElement("input"); submit.type = "button"; 
        submit.setAttribute('onclick', 'editTasklist(this.form)');
        submit.id = "updateSubmit"; submit.value = "UPDATE"; 
        form.appendChild(submit); 
        document.getElementById("demo").appendChild(form);
    }
}

function editTasklist(form) {
    for (let i = 1; i < (Object.keys(tasks).length); i++){
        if (form[`textEdit_${i}`].value != "") {
            tasks[i] = {
                "name": form[`textEdit_${i}`].value,
                "checked": form[`checkEdit_${i}`].checked,
            }
        }
    }
    localStorage.clear();
    localStorage.setItem('tasklist_1', JSON.stringify(tasks));
    console.log(document.getElementById("demo"));
    document.getElementById("demo").innerHTML = "";
    displayChecklist();

}

function addTask(form) {
    let length = Object.keys(tasks).length;
    if (form.addInput.value !== "") {
        tasks[length] = {
            "name": form.addInput.value,
            "checked": form.addChecked.checked,
        }
        localStorage.clear();
        console.log(tasks);
        localStorage.setItem('tasklist_1', JSON.stringify(tasks));
        console.log(localStorage)

        document.getElementById("demo").innerHTML = "";
        displayChecklist();
    }
}

function deleteTask(nb) {
    number = nb;
    tasks.splice(nb, 1);
    localStorage.clear();
    console.log(tasks);
    localStorage.setItem('tasklist_1', JSON.stringify(tasks));
    console.log(localStorage)

    document.getElementById("demo").innerHTML = "";
    openEdit();
    
}

function ShowHide(divId) {
    if (document.getElementById(divId).style.display == 'none') {
        document.getElementById(divId).style.display = 'block';
    }
    else {
        document.getElementById(divId).style.display = 'none';
    }
}