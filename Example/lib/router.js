const handlers = require('./handlers')
const routers = {
    // '' : handlers.ping,
    'test' : handlers.test,
    '' : handlers.index,
    'about' : handlers.about,
    'users' : handlers.users,
    'reviews' : handlers.reviews,
    'tasks' : handlers.task,
    'add_todo' : handlers.addTodo,
    'register' : handlers.account_create,
    'find_user' : handlers.find_user,
    '404' : handlers.notFound
}
module.exports = routers
