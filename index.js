const baseURL = "http://localhost:3000"
let id_update;

function landingPage() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").show()
    $("#signup").show()
    $("#login").show()
    $("#footer").show()
    $("#formLogin").hide()
    $("#formRegister").hide()
    $("#tableTodo").show()
    $("#create-button").hide()
    $("#create-form").hide()
    $("#update-form").hide()

}

function showRegister() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").hide()
    $("#formRegister").show()
    $("#formLogin").hide()
    $("#signup").show()
    $("#login").show()
    $("#footer").show()
    $("#tableTodo").hide()
    $("#create-button").hide()
    $("#create-form").hide()
    $("#update-form").hide()
}

function showLogin() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").hide()
    $("#formLogin").show()
    $("#formRegister").hide()
    $("#signup").show()
    $("#login").show()
    $("#footer").show()
    $("#tableTodo").hide()
    $("#create-button").hide()
    $("#create-form").hide()
    $("#update-form").hide()
}


function dashboard() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").show()
    $("#tableTodo").show()
    $("#login").hide()
    $("#signup").hide()
    $("#footer").show()
    $("#formLogin").hide()
    $("#formRegister").hide()
    $("#welcome").hide()
    $("#create-button").show()
    $("#create-form").hide()
    $("#update-form").hide()
}

function showCreateForm() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").show()
    $("#tableTodo").hide()
    $("#login").hide()
    $("#signup").hide()
    $("#footer").show()
    $("#formLogin").hide()
    $("#formRegister").hide()
    $("#welcome").hide()
    $("#create-button").show()
    $("#create-form").show()
    $("#update-form").hide()
}

function showUpdateForm() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").show()
    $("#tableTodo").hide()
    $("#login").hide()
    $("#signup").hide()
    $("#footer").show()
    $("#formLogin").hide()
    $("#formRegister").hide()
    $("#welcome").hide()
    $("#create-button").show()
    $("#create-form").hide()
    $("#update-form").show()
}

function signUp(event) {
    event.preventDefault() // untuk menghindari reload ketika on submit
    const email = $("#email").val()
    const password = $("#password").val()
    $.ajax({
        method: "POST",
        url: `${baseURL}/register`,
        data: {
            email,
            password
        }
    })
    .done(function(response){
        localStorage.setItem("token", response.token)
        console.log(response);
        dashboard()

    })
    .fail(function(err){
        console.log(err);
    })
}

function login(event) {
    event.preventDefault()
    const email = $("#emailLogin").val() 
    const password = $("#passLogin").val()
    console.log(email, "ini email");
    console.log(password, "ini pass");
    
    $.ajax({
        method: "POST",
        url: `${baseURL}/login`,
        data: {
            email,
            password
        }
    })
    .done(function(response) {
        localStorage.setItem("token", response.token)
        console.log(response);
        dashboard()
        showTodo()
        
    })
    .fail(function(err) {
        // alert(err.responseJSON.error);
        $("#errorPass").append(`<p> ${err.responseJSON.error} </p>`)
        
    })
}

function showTodo() {
    $.ajax({
        method: "GET",
        url: `${baseURL}/todos`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(function(response) {
        if(response){
            $("#tbody-list").empty()
            response.data.forEach(list => {
                $('#tbody-list').append(`
                <tr>
                        <th scope="row">1</th>
                        <td>${list.title}</td>
                        <td>${list.description}</td>
                        <td>${list.status}</td>
                        <td>${list.due_date}</td>
                        <td> <button class="btn btn-success" onclick="findOne(${list.id})">Edit</button> 
                             <button class="btn btn-danger" onclick="deleteTodo(${list.id})">Delete</button>
                             <button class="btn btn-info" onclick="updateStatus(${list.id})">Set to true</button>
                        </td>
                </tr>
                `)
            })
        }
    })
    .fail(function(err) {
        alert(err.response)
    })
}

function create(event) {
    event.preventDefault()
    const title = $("#title-create").val()
    const description = $("#description-create").val()
    const due_date = $("#due_date-create").val()
    const status = false
    $.ajax({
        method: "POST",
        url: `${baseURL}/todos`,
        data: {
            title,
            description,
            status,
            due_date
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(response => {
            dashboard()
            showTodo()
        })
        .fail(err => {
            console.log(err)
        })
}

function deleteTodo(id) {    
    $.ajax({
        method: "DELETE",
        url: `${baseURL}/todos/${id}`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(response => {
            dashboard()
            showTodo()
        })
        .fail(err => {
            alert("failed delete todo")
        })
}

function findOne(id) {
    id_update = id
    $.ajax({
        method: "GET",
        url: `${baseURL}/todos/${id}`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(response => {
            console.log(response);
            const dateVal = new Date(response.data.due_date)
            response.data.due_date = `${dateVal.getFullYear()}-${dateVal.getMonth()+1 < 10 ? "0" + (dateVal.getMonth()+1) : dateVal.getMonth()+1}-${dateVal.getDate() < 10 ? "0"+dateVal.getDate() : dateVal.getDate()}`
            showUpdateForm()
            $("#title-update").val(response.data.title)
            $("#description-update").val(response.data.description)
            // $("#due_date-update").val(m + "-" + d + "-" + y)
            $("#due_date-update").val(response.data.due_date)
        })
        .fail(err => {
            console.log(err);
            alert("failed update form")
        })
}

function update(event) {
    event.preventDefault()
    const title = $("#title-update").val()
    const description = $("#description-update").val()
    const due_date = $("#due_date-update").val()
    $.ajax({
        method: "PUT",
        url: `${baseURL}/todos/${id_update}`,
        data: {
            title,
            description,
            due_date
        },
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(response => {
            dashboard()
            showTodo()
        })
        .fail(err => {
            alert("failed updating data")
        })
}

function updateStatus() {
    
}

$(document).ready(function(){
    if(localStorage.token) {
        dashboard()
        showTodo()
    } else {
        landingPage() 
    }

    // $("#fetch").on("click", function(){ 
    //     showTodo()
    // })
    $("#create-button").on("click", function(){
        showCreateForm()
    })

    $("#login").on("click", function(){ 
        showLogin()
    })
  
    $("#signup").on("click", function(){
        showRegister()
    })

    $("#home").on("click", function(){
        landingPage()
    })

})