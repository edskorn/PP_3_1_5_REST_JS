let allRoles;

let currentUserId;

function getRoleName(id) {
    for (let i=0; i<allRoles.length; i++) {
        if (allRoles[i].id == id) {
            return allRoles[i].name;
        }
    }
}

async function getAllRoles(){
    let response = await fetch("/api/roles");

    if (response.ok) {
        allRoles = await response.json();
        fillRoles('add-user-roles');
        fillRoles('delete-user-roles');
        fillRoles('edit-user-roles');
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

function fillRoles(selectRolesElemName) {
    let selectRolesElem = document.getElementById(selectRolesElemName);

    if (selectRolesElem) {
        selectRolesElem.setAttribute('size', allRoles.length);

        for (let i = 0; i < allRoles.length; i++) {
            let optionRole = document.createElement('option');
            optionRole.setAttribute('value', allRoles[i].id);
            optionRole.innerText = allRoles[i].name;
            selectRolesElem.append(optionRole);
        }
    }
}

function parseUserFormToJSON(form){
    const formData = new FormData(form);

    let object = {};
    formData.forEach((value, key) => {
        if (key==="roles"){
            if(!Reflect.has(object, key)) {
                object[key] = [{"id": value, "name": getRoleName(value)}];
            } else {
                object[key].push({"id": value, "name": getRoleName(value)})
            }
        } else {
            if(!Reflect.has(object, key)){
                object[key] = value;
                return;
            }
            if(!Array.isArray(object[key])){
                object[key] = [object[key]];
            }
            object[key].push(value);
        }
    });

    form.reset();

    return JSON.stringify(object);
}

async function userInfo(currentUserId){
    let response = await fetch("/api/users/" + currentUserId);

    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        let currentUser = await response.json();

        window['currentUser-id'].innerText=currentUser.id;
        window['currentUser-name'].innerText=currentUser.name;
        window['currentUser-lastname'].innerText=currentUser.lastName;
        window['currentUser-age'].innerText=currentUser.age;
        window['currentUser-email'].innerText=currentUser.username;
        window['currentUser-roles'].innerText=currentUser.rolesToString;
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

async function allUsersInfo(){
    let response = await fetch("/api/users");

    if (response.ok) {
        let users = await response.json();

        let tableUsers = document.getElementById('table-users');
        tableUsers.innerHTML = "";

        for (let i = 0; i < users.length; i++) {
            let trUsers = document.createElement('tr');

            trUsers.innerHTML = '<td>' + users[i].id + '</td>';
            trUsers.innerHTML += '<td>' + users[i].name + '</td>';
            trUsers.innerHTML += '<td>' + users[i].lastName + '</td>';
            trUsers.innerHTML += '<td>' + users[i].age + '</td>';
            trUsers.innerHTML += '<td>' + users[i].username + '</td>';
            trUsers.innerHTML += '<td>' + users[i].rolesToString + '</td>';
            trUsers.innerHTML += `<td><button type="button" class="btn btn-info" data-toggle="modal" data-target="#edit-user-modal" onclick="clickEdit(${users[i].id})">Edit</button></td>`;
            trUsers.innerHTML += `<td><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete-user-modal" onclick="clickDelete(${users[i].id})">Delete</button></td>`;

            tableUsers.append(trUsers);
        }
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

async function addUser(user){
    let response = await fetch("/api/users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: user
    });

    //let result = await response.json();
    updateWindowData();
}

function handleSubmitAddUser(event) {
    event.preventDefault();

    let user = parseUserFormToJSON(event.target);

    addUser(user);
}

async function clickDelete(id){
    let response = await fetch("/api/users/" + id);

    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        let currentUser = await response.json();

        window['delete-user-id'].value=currentUser.id;
        window['delete-user-name'].value=currentUser.name;
        window['delete-user-lastname'].value=currentUser.lastName;
        window['delete-user-age'].value=currentUser.age;
        window['delete-user-email'].value=currentUser.username;
        window['delete-user-confirm'].setAttribute('onclick', `clickDeleteConfirm(${id})`);
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

async function clickDeleteConfirm(id){
    let response = await fetch("/api/users/" + id, {method: 'DELETE'});

    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        updateWindowData();
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

async function clickEdit(id){
    let response = await fetch("/api/users/" + id);

    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        let editUser = await response.json();

        window['edit-user-id'].value=editUser.id;
        window['edit-user-name'].value=editUser.name;
        window['edit-user-lastname'].value=editUser.lastName;
        window['edit-user-age'].value=editUser.age;
        window['edit-user-email'].value=editUser.username;
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

async function clickEditConfirm() {
    let form = document.getElementById('edit-user-form');
    let user = parseUserFormToJSON(form);

    let response = await fetch("/api/users", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: user
    });

    //let result = await response.json();

    updateWindowData();
}

function updateWindowData() {
    userInfo(currentUserId);

    let allUsersTab = document.getElementById('all-users-tab');
    let newUserTab = document.getElementById('new-user-tab');

    if (allUsersTab && newUserTab) {
        allUsersInfo();

        allUsersTab.classList.add('active');
        newUserTab.classList.remove('active');

        let allUsersTabLink = document.getElementById('all-users-tab-link');
        let newUserTabLink = document.getElementById('new-user-tab-link');

        allUsersTabLink.classList.add('active');
        newUserTabLink.classList.remove('active');
    }

}
