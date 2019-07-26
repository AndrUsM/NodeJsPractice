const helpers = {}
const fs = require('fs')
const path = require('path')
const config = require('./config')
const _data = require('./data')
const crypto = require('crypto')

helpers.parseJSON = (S) => {
    try{
        S = JSON.parse(S)
    }catch(err){
        return {}
    }
    return S
}
helpers.hash = (s) => {
    if(!s) return false
    let hash = crypto.createHmac('sha256', config.secret).update(s).digest('hex')
    return hash
}
helpers.getTemplate = async (templatename) => {
    if(!templatename) throw new Error('Invalid template')
    const tempdir = path.join(__dirname, '..','public', 'html')
    const filepath = path.join(tempdir, `${templatename}.html`)
    let page = ''
    try{
        page = await fs.readFileSync(filepath)
    }catch(err){
        throw new Error('No template')  
    }
    return page
}
helpers.addHeaderFooter = async (template) => {
    const header = await helpers.getTemplate('_header')
    const footer = await helpers.getTemplate('_footer')
    const page = header + template + footer
    return page
}
helpers.interpolate = (str, data = {}) => {
    Object.entries(config.globalTokens).forEach(([key, value]) => {
      data[`global.${key}`] = value
    })
    Object.entries(data).forEach(([key, value]) => {
      str = str.replace(`{${key}}`, value)
    })
    return str
}
helpers.addStyle = async (page, stylesheet) => {
    if(!stylesheet) throw new Error(`No stylesheet: ${stylesheet}.css`)
    const styleDir = path.join(__dirname, '..', 'template', 'stylesheets')
    const stylePath = path.join(styleDir, `${stylesheet}.css`)
    let styleData = ''
    if(!fs.exists(stylePath, () => {})){
        fs.appendFile(stylePath, '', () => {})
    }
    try{
        styleData = await fs.readFileSync(stylePath)
        page = page.replace(`{style.${stylesheet}}`, `<style>\n${styleData}\n</style>`)
    }catch(err){
        throw new Error(`Error reading stylesheet file: ${stylesheet}.css`)
    }
    return page
}
helpers.getStaticAsset = async (filename, extension) => {
    if(!filename) throw new Error('A valid static asset name was not specified')
    let assetsDir
    switch (extension) {
        case 'style':
            assetsDir = path.join(__dirname, '..')
            break;
        case 'image':
            assetsDir = path.join(__dirname, '..', 'public', 'images')
            break;
        case 'js':
            assetsDir = path.join(__dirname, '..')
            break;
        default:
            break;
    }
    const filepath = path.join(assetsDir, filename)
    let data
    try{
        data = await fs.readFileSync(filepath)
    }catch(err){
        throw new Error('No statis asset was found')
    }
    return data
}
helpers.generateRandomId = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
helpers.taskToJSON = (task) => {
    try{
        task = JSON.parse(task)
    }catch(err){
        return {}
    }
    return task
}
helpers.extract_object = (folder, obj) => {
    let list = _data.list(folder)
    obj_array = []
    list.map(item => {
        item = JSON.parse(item).obj
        obj_array.push(item)
    })
    return obj_array
}
helpers.identerficateMonth =  (id) =>  {
    let str = ''
    switch(id){
        case 0:
            str = 'Jan';
            break;
        case 1:
            str = 'Feb';
            break;  
        case 2:
            str = 'Mar';
            break;
        case 3:
            str = 'May';
            break;
        case 4:
            str = 'Apr';
            break;
        case 5:
            str = 'Jun';
            break;          
        case 6:
            str = 'Jul';
            break;
        case 7:
            str = 'Aug';
            break;
        case 8:
            str = 'Sep';
            break;
        case 9:
            str = 'Oct';
            break;
        case 10:
            str = 'Nov';
            break;
        case 11:
            str = 'Dec';
            break;
        default:
            str = 'Jan';
            break;
    }
    return str
}
module.exports = helpers