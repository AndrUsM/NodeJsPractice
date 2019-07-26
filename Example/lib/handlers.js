const handlers = {}
const helpers = require('./helpers')
const _data = require('./data')
const addvertise = require('./jokes/index')
const fs = require('fs')
const path = require('path')
const workers = require('./workers')
const random_sentence = require('./random_sentence_generator/index')

// For different types of data
handlers.public = async (data, cb) => {
    if(data.method !== 'get'){
        cb(405, null, 'html')
        return
    }
    try{
        let asset_name = data.trimmedPath.replace('public/images/', ''.trim())
        let content_type, extension
        switch (true) {
            case asset_name.includes('.css'):{
                content_type = 'css'
                extension = 'style'
                break;}
            case asset_name.includes('.png'):
                content_type = 'png'
                extension = 'image'
                break;
            case asset_name.includes('.jpg'):
            case asset_name.includes('.jpeg'):
                content_type = 'jpg'
                extension = 'image'
                break;
            case asset_name.includes('.ico'):
                content_type = 'favicon'
                extension = 'image'
                break;
            case asset_name.includes('.js'):
                content_type = 'js'
                extension = 'js'
                break;
            default:
                content_type = 'plain'
                extension = 'image'
                break;
        }
        let asset = await helpers.getStaticAsset(asset_name, extension)
        cb(200, asset, content_type)
    }catch(err){
        cb(404, null, 'html')
    }
}

//add favicon as x-image/icon
handlers.favicon = async (data, cb) => {
    if(data.method !== 'get'){
        cb(405, null, 'html')
        return
    }
    try{
        let logo = await helpers.getStaticAsset('favicon.ico', 'image')
        cb(200, logo, 'favicon')
    }
    catch(err){
        cb(500, null, 'html')
    }
}

//View pages
handlers.index = async (data, cb) => {
    if(data.method !== 'get'){
        cb(405, null, 'html')
    }
    const exampleData = {
        'text' : 'Http/Https Node Js application',
        'pageHeader' : 'Todo list app',
        'header.description' : 'You can create you todolist <a href = "add_todo">here</a>',
        'description' : 'Test work',
        'page_title' : 'Home page'
    }
    try{
        let template = await helpers.getTemplate('index')
        template = await helpers.addHeaderFooter(template)
        template = helpers.interpolate(template, exampleData)
        cb(200, template, 'html')
    }catch(err){
        cb(500, null, 'html')
    }
}
handlers.sign_in = async (data, cb) => {
    if(data.method !== 'get'){
        cb(405, null, 'html')
    }
    const exampleData = {
        'text' : 'Http/Https Node Js application',
        'pageHeader' : 'Todo list app',
        'header.description' : 'You can create you todolist <a href = "add_todo">here</a>',
        'page_title' : 'Search users'
    }
    try{
        let template = await helpers.getTemplate('sign_in')
        template = await helpers.addHeaderFooter(template)
        template = helpers.interpolate(template, exampleData)
        cb(200, template, 'html')
    }catch(err){
        cb(500, null, 'html')
    }
}
handlers.addTodo = async (data, cb) => {
    if(data.method !== 'get'){
        cb(405, null, 'html')
    }
    const exampleData = {
        'text' : 'Http/Https Node Js application',
        'pageHeader' : 'Todo list app',
        'header.description' : 'You can create you todolist <a href = "add_todo">here</a>',
        'todos_list_data' : await _data.formatedList('tasks'),
        'todo_placeholder' : `&quot;${random_sentence.sentence()}&quot;`,
        'page_title' : 'ToDo List'
    }
    try{
        let template = await helpers.getTemplate('addTodo')
        template = await helpers.addHeaderFooter(template)
        template = helpers.interpolate(template, exampleData)
        cb(200, template, 'html')
    }catch(err){
        cb(500, null, 'html')
    }
}

handlers.about = async (data, cb) => {
    if(data.method !== 'get'){
        cb(405, null, 'html')
    }
    const exampleData = {
        'pageHeader' : 'Todo list app',
        'header.description' : 'You can create you todolist <a href = "add_todo">here</a>',
        'date1' : `How i started my way ${new Date().getUTCFullYear()},${helpers.identerficateMonth(new Date().getMonth())}, ${new Date().getDate()}`,
        'date2' : `How i need work ${new Date().getUTCFullYear()},${helpers.identerficateMonth(new Date().getMonth())}, ${new Date().getDate()}`,
        'addvertise' : fs.readFileSync(path.join(__dirname, 'jokes', 'jokesLib', '.data', `comment.dat`),'utf8'),
        'page_title' : 'About'
    }
    try{
        let template = await helpers.getTemplate('about')
        template = await helpers.addHeaderFooter(template)
        template = helpers.interpolate(template, exampleData)
        cb(200, template, 'html')
    }catch(err){
        cb(500, err, 'html')
    }
}

handlers.account_create = async (data, cb) => {
    if(data.method !== 'get')
        cb(405, null, 'html')
    let templateData = {
        'text' : 'Http/Https Node Js application',
        'pageHeader' : 'Todo list app',
        'header.description' : 'You can create you todolist <a href = "add_todo">here</a>',
        'page_title' : 'Register Page',
        'page_title' : 'Error 404'
    }
    try{
        let template = await helpers.getTemplate('register')
        template = await helpers.addHeaderFooter(template)
        template = helpers.interpolate(template, templateData)
        cb(200, template, 'html')
    }catch(err){
        cb(500, null, 'html')
    }
}

handlers.notFound = async (data, cb) => { 
    if(data.method !== 'get'){
        cb(405, null, 'html')
    }
    let errorData = {
        code: 404,
        message: 'Page not found',
        'pageHeader' : 'Todo list app',
        'header.description' : 'You can create you todolist <a href = "add_todo">here</a>',
    }
    try{
        let template = await helpers.getTemplate('errorPage')
        template = await helpers.addHeaderFooter(template)
        template = helpers.interpolate(template, errorData)
        cb(200, template, 'html')
    }catch(err){
        cb(500, err, 'html')
    }
}

// ------------------------------------ Tasks --------------------------------------
handlers.task = {}
handlers.task = async (data, cb) => {
    const acceptable_methods = ['get', 'post', 'put', 'delete']
    if(!acceptable_methods.includes(data.method)){
        cb(405, null, 'html')
    }
    handlers._task[data.method](data,cb)
}
handlers._task = {}
handlers._task.get = async (data, cb) => {
    const workDirectory = 'tasks'
    if(!fs.existsSync(path.join(__dirname, '..', '.hidden','.data', workDirectory, `${data.query.id}.json`))){
        cb(404, {error: 'Invalid task'})
    }
    let task = JSON.parse(await _data.read(workDirectory, data.query.id))
    try{
        try{
            if(task){
                await workers.create_log(`Get: ${JSON.stringify(task)}`)
                cb(200, task, 'json')
            }
        }catch(err){
            cb(404, null, 'html')
        }
    }catch(err){
        cb(403, null, 'html')
    }
}
handlers._task.post = async (data, cb) => {
    let task = typeof data.query.task == 'string' && data.query.task.trim().length > 0 ? data.query.task.trim() : false
    // let task = "Delete something"
    let hash_id = helpers.hash(task)
    const workDirectory = 'tasks'
    if(task){
        try{
            await _data.read(workDirectory, hash_id)
            cb(400, {error: 'Task already exist'})
        }catch(err){
            try{
                let _id = helpers.hash(task)
                if(!_id) throw new Error('Invalid payload: hash')
                let current_date = `${new Date().getUTCFullYear()}.${new Date().getUTCMonth()}.${new Date().getDate()}`
                let taskObj = {
                    _id: _id,
                    task: task,
                    created_at: current_date
                }
                await _data.create(workDirectory, _id, JSON.stringify(taskObj))
                await workers.create_log(JSON.stringify(taskObj))
                cb(201, {task: (taskObj)}, 'json')
            }catch(err){
                cb(500, {error: err})
            }
        }
    }else{
        cb(400, 'Invalid payload')
    }
}
handlers._task.put = async (data, cb) => {
    const workDirectory = "tasks"
    let id = typeof data.query.id === 'string' && data.query.id.trim().length > 0 ? data.query.trim() : false
    let task = typeof data.query.task === 'string' && data.query.task.trim().length > 0 ? data.query.task.trim() : false
    if(id){
        try{
            await _data.read(workDirectory, id)
            if(true){
                let taskObj = {
                    _id: id,
                    task: task
                }
                await _data.update(workDirectory,id, taskObj)
                await workers.create_log(JSON.stringify(taskObj))
                cb(201, {task: JSON.stringify(taskObj)}, 'json')
            }
        }catch(err){
            cb(404, {error: 'Task not exist'})
        }
    }else{
        cb(400, {error: 'Missing required fields'})
    }
}
handlers._task.delete = async (data, cb) => {
    const workDirectory = 'tasks'
    // let id = typeof data.query.id === 'string' && data.query.id.trim().length > 0 ? data.query.trim() : false
    let id = data.query.id
    if(id){
        try{
            await _data.read(workDirectory, id)
            await _data.delete(workDirectory, id)
            await workers.create_log(`Del: ${id}`)
        }catch(err){
            cb(404, {error: 'Task not exist'})
        }
    }else{
        cb(400, {error: 'Invalid payload'})
    }
}

// ------------------------------------ Users --------------------------------------
handlers.users = async (data, cb) => {
    const acceptable_methods = ['post', 'get', 'delete', 'put']
    if(!acceptable_methods.includes(data.method))
        cb(405, null, 'html')
    handlers._users[data.method](data, cb)
}
handlers._users = {}
handlers._users.get = async (data, cb) => {
    const workDirectory = 'users'
    let email = typeof data.query.email == 'string' && data.query.email.trim().length ? data.query.email.trim() : false
    if(!fs.existsSync(path.join(__dirname, '..', '.hidden', '.data', workDirectory,`${email}.json`))){
        cb(404, {error: 'Invalid email'})
    }
    let user = JSON.parse(await _data.read(workDirectory, data.query.email)) // if write something like <.email>, you get property of json object
    try{
        try{
            if(user){
                await workers.create_log(`Get: ${JSON.stringify(user)}`)
                cb(200, user, 'json')
            }
        }catch(err){
            cb(404, null, 'html')
        }
    }catch(err){
        cb(403, null, 'html')
    }
}
handlers._users.post = async (data, cb) => {
    const workDirectory = 'users'

    let firstname = typeof data.query.firstname == 'string' && data.query.firstname.trim().length > 0 ? data.query.firstname.trim() : false
    let lastname = typeof data.query.lastname == 'string' && data.query.lastname.trim().length > 0 ? data.query.lastname.trim() : false
    let email = typeof data.query.email == 'string' && data.query.email.trim().length > 0 ? data.query.email.trim() : false
    let password = typeof data.query.password == 'string' && data.query.password.trim().length > 0 ? data.query.password.trim() : false
    let licence_agree = typeof data.query.licence_agree == 'string' && data.query.licence_agree === 'true'? true : false

    // let firstname = "August", lastname = 'Doe', email = "kikstart09@gmail.com", password = "hjdfxcv8jk", licence_agree = true ///// Test post data

    if(firstname && lastname && email && password && licence_agree){
        try{
            await _data.read(workDirectory, email)
            cb(400, {error: 'User with this email already exist'})
        }catch(err){
            try{
                let hashed_password = helpers.hash(password)
                if(!hashed_password) throw new Error('Invalid payload: hash')
                let current_date = `${new Date().getUTCFullYear()}.${new Date().getUTCMonth()}.${new Date().getDate()}`
                let user = {
                    firstname : firstname,
                    lastname : lastname,
                    email : email,
                    password : password,
                    created_at: current_date,
                    licence_agree : true,
                    hashed_password : hashed_password
                }
                await _data.create(workDirectory, email, JSON.stringify(user))
                await workers.create_log(JSON.stringify(user))
                cb(201, {user: user}, 'json')
            }catch(err){
                cb(500, {error: err})
            }
        }
    }
    else{
        cb(400, {error: 'Invalid payload or need to agree with the license'})
    }
}
handlers._users.put = async (data, cb) => {
    let email = typeof data.query.email == 'string' && data.query.email.trim().length > 5 && data.query.email.includes('@') && data.query.email.includes('.')
    ? data.query.email.trim() : false

    let firstname = typeof data.query.firstname == 'string' && data.query.firstname.trim().length > 0 ? data.query.firstname.trim() : false
    let lastname = typeof data.query.lastname == 'string' && data.query.lastname.trim().length > 0 ? data.query.lastname.trim() : false
    let password = typeof data.query.password == 'string' && data.query.password.trim().length > 0 ? data.query.password.trim() : false
    const workDirectory = 'users'
    if(firstname, lastname, email, password){
        try{
            await _data.read(workDirectory, email)
            let hashed_password = helpers.hash(password)
                if(!hashed_password) throw new Error('Invalid payload: hash')
                    let user = {
                        firstname : firstname,
                        lastname : lastname,
                        email : email,
                        password : password,
                        licence_agree: true,
                        hashed_password : hashed_password
                    }
                await _data.update(workDirectory, email, JSON.stringify(user))
                await workers.create_log(JSON.stringify(user))
                cb(201, {user: JSON.stringify(user)}, 'json')
        }catch(err){
            cb(404, {error: 'User not exist'})
        }
    }else{
        cb(400, {error: 'Missing require field'})
    }
}

handlers._users.delete = async (data, cb) => {
    let email = data.query.email
    const workDirectory = 'users'
    email = typeof email === 'string' && email.trim.length > 5 && email.includes('@') && email.includes('.')
     ? email.trim() : false
    if(email){
        try{
            await _data.read(workDirectory, email)
            await _data.delete(workDirectory, email)
            await workers.create_log(`Del: ${email}`)
        }catch(err){
            cb(404, {error: 'User not exist'})
        }
    }else{
        cb(500, {error: 'Invalid payload'})
    }
}

// ------------------------------------ Reviews --------------------------------------
handlers.reviews = async (data, cb) => {
    const acceptable_methods = ['post', 'get']
    if(!acceptable_methods.includes(data.method))
        cb(405, null, 'html')
    handlers._reviews[data.method](data, cb)
}
handlers._reviews = {}
handlers._reviews.post = async (data, cb) => {
    let user = typeof data.query.author == 'string' && data.query.author.trim().length > 0 ? data.query.author.trim() : false
    let user_review = typeof data.query.review == 'string' && data.query.review.trim().length > 0 ? data.query.review.trim() : false
    
    const workDirectory = 'reviews'
    if(user && user_review){
        try{
            await _data.read(workDirectory, id)
            cb(400, {error: 'Reviews with this id already exist'})
        }catch(err){
            try{
                let id = helpers.generateRandomId(+(user_review.length/user.length))
                if(!id) throw new Error('Invalid payload: hash')

                let current_date = `${new Date().getUTCFullYear()}.${new Date().getUTCMonth()}.${new Date().getDate()}`
                let user_review_obj = {
                    _id: id,
                    author: user,
                    text: user_review,
                    created_at: current_date
                }
                await _data.create(workDirectory, `${user}_${id}}`, JSON.stringify(user_review_obj))
                await workers.create_log(JSON.stringify("POST: " + user_review_obj))
                cb(201, {review: (user_review_obj)}, 'json')
            }catch(err){
                cb(500, {error: err})
            }
        }
    }else{
        cb(400, 'Invalid payload')
    }
}
handlers._reviews.get = async (data, cb) => {
    const workDirectory = 'reviews'
    if(!fs.existsSync(path.join(__dirname, '..', '.hidden', '.data', workDirectory,`${data.query.id}.json`))){
        cb(404, {error: 'Invalid id'})
    }
    let review_text = JSON.parse(await _data.read(workDirectory, data.query.id)) // if write something like <.email>, you get property of json object
    try{
        try{
            if(review_text){
                await workers.create_log(`Get: ${JSON.stringify(review_text)}`)
                cb(200, review_text, 'json')
            }
        }catch(err){
            cb(404, null, 'html')
        }
    }catch(err){
        cb(403, null, 'html')
    }
}
// ------------------------------------ Services Handlers --------------------------------------
handlers.ping = async (data, cb) => {
    cb(200, null, 'html')
}
handlers.test = async (data, cb) => {   
    cb(200, {message: 'Hello World', data}, 'json')
}
module.exports = handlers
