// AJAX requests and fronend logic for application

let app = {}
app.request = {}

app.request.get = {}
app.request.post = {}
app.request.delete = {}

app.request.post.post_request_tasks = async () => {
    let xhr = new XMLHttpRequest()
    let input = document.querySelector('input').value.length === 0 ? document.querySelector('input').placeholder.toString().replace(/"/gi, '') : document.querySelector('input').value
    xhr.open('POST', `tasks?task=${input}`, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => {
        if(xhr.status == 200){
            let task = JSON.stringify(xhr.responseText)
        }
    }
    xhr.send()
}
app.request.get.find_user = async () => {
    let xhr = new XMLHttpRequest()
    let input = document.querySelector('input').value
    xhr.open('GET', `users?email=${input}`, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => {
        if(xhr.status == 200){
            document.querySelector('table').style.display = 'table'
            let user = JSON.parse(xhr.responseText)
            document.querySelector('.fn').innerHTML = user.firstname
            document.querySelector('.ln').innerHTML = user.lastname
            document.querySelector('.em').innerHTML = user.email
            document.querySelector('.ps').innerHTML = user.password
        }
    }
    xhr.send()
}
app.request.delete.delete_request_tasks = async () => {
    let xhr = new XMLHttpRequest()
    document.addEventListener('click', (e) => {
        let task_id = e.target.id
        xhr.open('DELETE', `tasks?id=${task_id}`, true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onload = () => {
            if(xhr.status == 200){
                let task = JSON.stringify(xhr.responseText)
            }
        }
        xhr.send(null)
        window.location.reload()
    })
}
app.request.post.post_request_users = async () => {
    let xhr = new XMLHttpRequest()

    let first_name = document.querySelector('#first_name').value
    let last_name = document.querySelector('#last_name').value
    let email = document.querySelector('#email').value
    let password = document.querySelector('#password').value
    let licence_agree = document.querySelector('#licence_agree').checked

    xhr.open('POST', `users?firstname=${first_name}&lastname=${last_name}&email=${email}&password=${password}&licence_agree=${licence_agree}`, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => {
        if(xhr.status == 200){
            let task = JSON.stringify(xhr.responseText)
        }
    }
    xhr.send()
    
}
app.request.post.post_request_reviews = async () => {
    let xhr = new XMLHttpRequest()

    let author = document.querySelector('#author').value
    let text = document.querySelector('#review').value || document.querySelector('#review').placeholder

    xhr.open('POST', `reviews?author=${author}&review=${text}`, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => {
        if(xhr.status == 200){
            let task = JSON.stringify(xhr.responseText)
        }
    }
    xhr.send()
}
app.init_function = {}
app.init_function.addTodo = () => {
    if(!window.location.href.includes('add_todo'))
        return
    let form = document.querySelector('form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        app.request.post.post_request_tasks()
        window.location.reload()
    })
}
app.init_function.registerUser = () => {
    if(!window.location.href.includes('register'))
        return
    let form = document.querySelector('form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        app.request.post.post_request_users()
        window.location.reload()
        window.location.href = "/add_todo"
    })
}
app.init_function.sendReview = () => {
    if(!window.location.href.includes('about'))
        return
    let form = document.querySelector('form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        app.request.post.post_request_reviews()
        // window.location.reload()
        window.location.href = "/about"
    })
}
app.init_function.delete_task = () => {
    if(!window.location.href.includes('add_todo')) return
    app.request.delete.delete_request_tasks()
}
app.init_function.find_get = () => {
    if(!window.location.href.includes('find_user')) return
    let form = document.querySelector('.register_form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        app.request.get.find_user()
    })
}
document.addEventListener('DOMContentLoaded', () => {
    app.init_function.addTodo()
    app.init_function.registerUser()
    app.init_function.sendReview()
    app.init_function.delete_task()
    app.init_function.find_get()
})