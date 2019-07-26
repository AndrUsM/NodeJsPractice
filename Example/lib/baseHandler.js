const url = require('url')
const { StringDecoder } = require('string_decoder')
const router = require('./router')
const handler = require('./handlers')
const fs = require('fs')
const path = require('path')

const baseHandler = async (req, res) => {
    let decoder = new StringDecoder('utf8')
    let parsedUrl = url.parse(req.url, true)
    let path = parsedUrl.pathname
    let trimmedPath = path.replace(/^\/+|\/+$/g, '')
    let method = req.method.toLowerCase()

    let buffer = ''
    req.on('data', data => {
        buffer += decoder.write(data)
    })
    req.on('end', () => {
        buffer += decoder.end()

        let reqHandler = router[trimmedPath] || handler.notFound
        if(trimmedPath.includes('public/images') || trimmedPath.includes('public/css') || trimmedPath.includes('public/js')){
            reqHandler = handler.public
        }
        let data = {
            trimmedPath,
            query: parsedUrl.query,
            method,
            headers: req.headers,
            payload: buffer
        }
        reqHandler(data, (statusCode = 200, payload, contentType = 'json') => {
            switch(contentType){
                case 'json':{
                    payload  = JSON.stringify(payload)
                    res.setHeader('Content-Type', 'application/json')
                    break
                }
                case 'html': {
                    res.setHeader('Content-Type', 'text/html')
                    break
                }
                case 'favicon':
                        res.setHeader('Content-Type', 'image/x-icon')
                        break
                case 'css': {
                    res.setHeader('Content-Type', 'text/css')
                    break
                }
                case 'js': {
                    res.setHeader('Content-Type', 'text/javascript')
                    break;
                }
                case 'png': {
                    res.setHeader('Content-Type', 'image/png')
                    break
                }
                case 'jpg': {
                    res.setHeader('Content-Type', 'image/jpeg')
                    break
                }
                case 'plain':
                default:{
                    res.setHeader('Content-Type', 'text/plain')
                }
            }
            res.writeHead(statusCode)
            res.end(payload)
        })
    })
}
module.exports = baseHandler