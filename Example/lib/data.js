const path = require('path')
const fs = require('fs')
const helpers = require('./helpers')
const { StringDecoder } = require('string_decoder')
const lib = {}

const stringDecoder = new StringDecoder('utf8')

lib.baseDir = path.join(__dirname, '..' ,'.hidden' ,'.data')
lib.create = async (dir, filename, data) => {
    let file//buffer variable
    let filepath = path.join(lib.baseDir, dir, `${filename}.json`)
    try{
        file = await fs.appendFileSync(filepath, data)
    }catch(err){
        throw new Error(`Error creating file: ${filename}.json`)
    }
    return data
}
lib.exist = async (dir, filename) => {
    let file
    try{
        let filepath = path.join(__dirname, '..', dir, `${filename}.json`)
        await fs.existsSync(filepath) == true ? true : false
    }catch(err){
        throw new Error(`Error fincing path: ${path.join(__dirname, '..', dir, `${filename}.json`)}`)
    }
}
lib.delete = async (dir, filename) => {
    let filepath = path.join(lib.baseDir, dir, `${filename}.json`)
    try{
        await fs.unlinkSync(filepath)
    }catch(err){
        throw new Error(`Error deleting file: ${filename}.json`)
    }
}
lib.update = async (dir, filename, data) => {
    let filepath = path.join(lib.baseDir, dir, `${filename}.json`)
    let file
    try{
        file = fs.writeFile(filepath, data, (err) => {})
    }
    catch(err){
        throw new Error(`Error writing data to ${filename}.json`)
    }
    return data
}
lib.read = async (dir, filename) => {
    let filepath = path.join(lib.baseDir, dir, `${filename}.json`)
    let content = ''
    try{
        content = await fs.readFileSync(filepath, {encoding: 'utf8'})
    }catch(err){
        throw new Error(`Error reading file ${filename}`)
    }
    return content
}
lib.list = async (dir) => {
    let dirpath = path.join(lib.baseDir, dir)
    try {
      let list = await fs.readdirSync(dirpath)
      list = list.map(fileName => fileName.replace(/\.json$/, ''))
      list = await Promise.all(list.map(async filename => lib.read(dir, filename)))
      return list
    } catch (err) {
        throw new Error(`Error reading list ${dirpath}`)
    }
}
// Methods for directory
lib.deleteDir = async (dir) => {
    let filesPath = path.join(lib.baseDir, dir)
    try{
        await fs.rmdirSync(filesPath)
    }
    catch(err){
        throw new Error(`Error deleting folder:${dir}`)
    }
}
lib.createDir = async (dir) => {
    let filesPath = path.join(lib.baseDir, dir)
    try{
        await fs.mkdirSync(filesPath)
    }
    catch(err){
        throw new Error(`Error creating folder:${dir}`)
    }
}
lib.formatedList = async (folder) => {
    let list = await lib.list(folder)
    let tasks = [], time = [], id = []
    list.map(item => {
        item = JSON.parse(item).task
        tasks.push(item)
    })
    list.map(item => {
        item = JSON.parse(item).created_at
        time.push(item)
    })
    list.map(item => {
        item = JSON.parse(item)._id
        id.push(item)
    })
    let ul = '<ul>'
    for(let i = 0; i < tasks.length; i++){
        ul += `<li id = ${id[i]}>${tasks[i]} <span>${time[i]}</span><span style = "display:none; class="task_id"></span></li>`
    }
    ul += '</ul>'
    return ul
}
module.exports = lib
// lib.createDir('tasks')
// lib.create('tasks', 'downloadmusic', '{"text": "download music"}')
// lib.delete('tasks', 'createapi')
// let test = async () => {
//     let text = await lib.list('tasks')
//     console.log(text)
// }
// test()
// lib.read('tasks', 'createapi')
