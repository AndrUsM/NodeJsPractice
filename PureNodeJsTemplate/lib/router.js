const handlers = require('./handlers')
const routers = {
    '' : handlers.ping,
    'test' : handlers.test,
    'index' : handlers.index
}
module.exports = routers