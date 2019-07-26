const EventEmitter = require('events')
const readline = require('readline')
const _data = require('./data')
const workers = require('./workers')
const open = require('open')
const config = require('./config')
const cli = {}

cli.folder_name = `${new Date().getUTCFullYear()}.${new Date().getUTCMonth()}.${new Date().getUTCDate()}`
cli.available_commands = ['help', 'users', 'tasks', 'user', 'task', 'exit', 'clear', 'recent users', 'recent tasks', 'delete tasks', 'delete task', 'open google-chrome', 'open firefox', 'reviews', 'recent reviews']
class CLIEmmitter extends EventEmitter {}
const emmitter = new CLIEmmitter()

//------------------FORMATING FUNCTIONS-----------------------
cli.format = {}
cli.format.horizontal_line = () => {
    const width = process.stdout.columns
    let line = ''
    for(let i = 0; i < width; i++){
        line += '*'
    }
    console.log(line)
}
cli.format.vertical_line = (lines) => {
    lines = +(line) || 1
    for(let i = 0; i < lines; i++)
        console.log('')
}
cli.format.centered = (str) => {
    const width = process.stdout.columns
    const leftPadding = Math.floor((width - str.length) / 2)
    let line = ''
    for (let i = 0; i < leftPadding; i++) {
      line += ' '
    }
    line += str
    console.log(line)
}

//------------------EVENT LISTENERS-----------------------
emmitter.on('help', (line) => {
    cli.responders.help()
})
emmitter.on('exit', () => {
    cli.responders.exit()
})
emmitter.on('users', () => {
    cli.responders.users()
})
emmitter.on('tasks', () => {
    cli.responders.tasks()
})
emmitter.on('user', (line) => {
    let user_email = line.split(' ')[1]
    cli.responders.user_details(user_email)
})
emmitter.on('task', (line) => {
    let task_hash = line.split(' ')[1]
    cli.responders.task_details(task_hash)
})
emmitter.on('clear', () => {
    cli.responders.clear()
})
emmitter.on('recent users', () => {
    cli.responders.user_this_day()
})
emmitter.on('recent tasks', () => {
    cli.responders.tasks_this_day()
})
emmitter.on('delete tasks', () => {
    cli.responders.delete_tasks()
})
emmitter.on('delete task', (line) => {
    let task_hash = line.split(' ')[2]
    cli.responders.delete_task(task_hash)
})
emmitter.on('open google-chrome', () => {
    (async () => {
        await open(config.globalTokens.baseUrl, {app: ['google-chrome']});
    })();
})
emmitter.on('open firefox', () => {
    (async () => {
        await open(config.globalTokens.baseUrl, {app: 'firefox'});
    })()
})
emmitter.on('recent reviews', () => {
    cli.responders.reviews_this_day()
})
emmitter.on('reviews', () => {
    cli.responders.reviews()
})

//------------------EVENT HANDLERS-----------------------
cli.responders = {}
cli.responders.help = () => {
    const commands = {
        'help' : 'Show help page',
        'users' : 'Show user list',
        'tasks' : 'Show task list',
        'user {{email}}' : 'Show user with {{email}}',
        'task {{hash}}' : 'Show task with {{hash}}',
        'exit' : 'Exit from command line interface',
        'clear' : 'Clear console',
        'recent users' : 'Show registered users today',
        'recent tasks' : 'Show created tasks today',
        'delete tasks' : 'Delete all tasks',
        'delete task {{hash_id}}' : 'Delete task with id: hash_id',
        'open google-chrome' : 'Open page in google chrome',
        'reviews' : 'View all reviews info',
        'recent reviews' : 'View all review that was sended today'
    }
    Object.entries(commands).forEach(([key, value]) => {
        let line = `\x1b[33m${key}: ${value}\x1b[0m`
        let padding = 60 - line.length
        for(let i = 0; i < padding; i++){
            line += ' '
        }
        console.log(line)
    })
    cli.format.horizontal_line()
}
cli.responders.users = async () => {
    try{
        let users = await _data.list('users')
        users.forEach(item => {
            item = JSON.parse(item)
            let line = `firstname: ${item.firstname}\nlastname: ${item.lastname}\nemail: ${item.email}\npassword: ${item.password}\n`
            console.log(line)
        }) 
    }catch(err){
        throw new Error(`Error reading from users`)
    }
}
cli.responders.tasks = async () => {
    try{
        let tasks = await _data.list('tasks')
        tasks.forEach(item => {
            console.log(item)
            item = JSON.parse(item)
            let line = `_id: ${item._id}\ntext: ${item.task}\n`
            console.log(line)
        })        
    }catch(err){
        throw new Error(`Error reading from users`)
    }
}
cli.responders.task_details = async (hash) => {
    if(!hash){
        console.log('Please enter correct hash')
        return
    }
    try{
        let task = await _data.read('tasks', hash)
        task = JSON.parse(task)
        console.log(`_id: ${task._id}`)
        console.log(`text: ${task.task}`)
    }catch(err){
        throw new Error('Error reading task with current hash')
    }
}
cli.responders.user_details = async (email) => {
    if(!email){
        console.log('Please enter user email')
        return
    }
    try{
        let user = await _data.read('users', email)
        user = JSON.parse(user)
        console.log(`\nfirstname: ${user.firstname}`)
        console.log(`lastname: ${user.lastname}`)
        console.log(`email: ${user.email}`)
        console.log(`password: ${user.password}\n`)
    }catch(err){
        throw new Error('Error reading user with current email')
    }
}
cli.responders.exit = () => {
    process.exit()
}
cli.responders.clear = () => {
    process.stdout.write('\033c');
}
cli.responders.user_this_day = async () => {
    let users = await _data.list('users')
    let emails = [], firstname = [], date = [], lastname = []
    users.map(item => {
        item = JSON.parse(item).email
        emails.push(item)
    })
    users.map(item => {
        item = JSON.parse(item).firstname
        firstname.push(item)
        
    })
    users.map(item => {
        item = JSON.parse(item).lastname
        lastname.push(item)
        // console.log(item)
    })
    users.map(item => {
        item = JSON.parse(item).created_at
        date.push(item)
    })
    for(let i = 0; i < emails.length; i++){
        if(date[i].split('.')[1] == new Date().getUTCMonth() 
        && date[i].split('.')[2] == new Date().getDate()
        && date[i].split('.')[0] == new Date().getUTCFullYear()){
            let line = `\nFirstname: ${firstname[i]}\nLastname: ${lastname[i]}\nEmail: ${emails[i]}\nDate: ${date[i]}\n`
            console.log(line)
        }
    }
}
cli.responders.reviews_this_day = async () => {
    let reviews = await _data.list('reviews')
    let author = [], text = [], date = []
    reviews.map(item => {
        item = JSON.parse(item).author
        author.push(item)
    })
    reviews.map(item => {
        item = JSON.parse(item).text
        text.push(item)
    })
    reviews.map(item => {
        item = JSON.parse(item).created_at
        date.push(item)
        text.push(item)
    })
    for(let i = 0; i < author.length; i++){
        if(date[i].split('.')[1] == new Date().getUTCMonth() 
        && date[i].split('.')[2] == new Date().getDate()
        && date[i].split('.')[0] == new Date().getUTCFullYear()){
            let line = `\nAuthor: ${author[i]}\nText: ${text[i]}`
            console.log(line)
        }
    }
}
cli.responders.tasks_this_day = async () => {
    let tasks = await _data.list('tasks')
    let id = [], text = [], date = []
    tasks.map(item => {
        item = JSON.parse(item)._id
        id.push(item)
    })
    tasks.map(item => {
        item = JSON.parse(item).task
        text.push(item)
    })
    tasks.map(item => {
        item = JSON.parse(item).created_at
        date.push(item)
    })
    for(let i = 0; i < id.length; i++){
        if(date[i].split('.')[1] == new Date().getUTCMonth() 
        && date[i].split('.')[2] == new Date().getDate()
        && date[i].split('.')[0] == new Date().getUTCFullYear()){
            let line = `\ntext: ${text[i]}\nDate: ${date[i]}\n`
            console.log(line)
        }
    }
}
cli.responders.delete_tasks = async () => {
    let list = await _data.list('tasks')
    // console.log(list)
    try{
        if(!list){
            throw new Error(`Error getting list`)
        }
        list.map(item => {
            item = JSON.parse(item)
            _data.delete('tasks', item._id)
        })
    }catch(err){
        throw new Error(`Error deleting files`)
    }
}
cli.responders.delete_task = async (hash) => {
    await _data.delete('tasks', hash)
}
cli.responders.reviews = async () => {
    try{
        let reviews = await _data.list('reviews')
        reviews.forEach(item => {
            item = JSON.parse(item)
            let line = `Author: ${item.author}\nText: ${item.text}\nDate: ${item.created_at}\n`
            console.log(line)
        }) 
    }catch(err){
        throw new Error(`Error reading from users`)
    }
}
cli.init = () => {
    emmitter.emit('clear')
    workers.rotate()
    console.log('\nWELCOME TO APPLICATION\nAvailable commands:\n')
    cli.responders.help()
    const read_line = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    read_line.prompt()
    read_line.on('line', (line) => {
        let matched_command = cli.available_commands.find(command => line.startsWith(command))
        if(matched_command) emmitter.emit(matched_command, line)
        else console.log('Sorry, try again')
        read_line.prompt()
    })
    read_line.on('close', () => {
        process.exit(0)
    })
}
module.exports = cli