const helpers = {}
const fs = require('fs')
const path = require('path')
const config = require('./config')
const {StringDecoder} = require('string_decoder')

helpers.parseJSON = (S) => {
    try{
        S = JSON.parse(S)
    }catch(err){
        return {}
    }
    return S
}
helpers.getTemplate = async (templatename) => {
    if(!templatename) throw new Error('Invalid template')
    const tempdir = path.join(__dirname, '..', 'html')
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
            assetsDir = path.join(__dirname, '..', 'images')
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
module.exports = helpers