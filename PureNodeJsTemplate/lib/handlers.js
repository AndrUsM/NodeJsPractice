const handlers = {}
const helpers = require('./helpers')
handlers.notFound = async (data, cb) => {
    cb(404, null, 'html')
}
handlers.ping = async (data, cb) => {
    cb(200, null, 'html')
}
handlers.test = async (data, cb) => {   
    cb(200, {message: 'Hello World', data}, 'json')
}
handlers.index = async (data, cb) => {
    if(data.method !== 'get'){
        cb(405, null, 'html')
    }
    const exampleData = {
        'text' : 'Http/Https Node Js application',
        'description' : 'Welcome to application. You can transform this template as you can.'
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
handlers.public = async (data, cb) => {
    if(data.method !== 'get'){
        cb(405, null, 'html')
        return
    }
    try{
        let asset_name = data.trimmedPath.replace('images/', ''.trim())
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
module.exports = handlers
