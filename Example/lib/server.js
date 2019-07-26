const http = require('http')
const https = require('https')
const baseHandler = require('./baseHandler')
const fs = require('fs')
const path = require('path')
const config = require('./config')
const open = require('open')
const cli = require('./cli')
const workers = require('./workers')

const httpPath = path.join(__dirname, '..', 'https')
const server_options = {
    key: fs.readFileSync(path.join(httpPath, 'key.pem')),
    cert: fs.readFileSync(path.join(httpPath, 'cert.pem'))
}
const https_server = https.createServer(server_options)
const http_server = http.createServer(baseHandler)

const server = {}
server.run = () => {
    http_server.listen(config.httpPort, () => {
        console.log(`Http started: http://127.0.0.1:${config.httpPort}`);
    })
    https_server.listen(config.httpsPort, () => {
        console.log(`Https started at ${config.httpsPort}`)
    })
    cli.init()
}
module.exports = server
