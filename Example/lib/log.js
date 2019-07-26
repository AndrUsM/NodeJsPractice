const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const lib = {}

const backup = {}
backup.folder_name = `${new Date().getUTCFullYear()}.${new Date().getUTCMonth()}.${new Date().getUTCDate()}`
backup.base_dir = path.join(__dirname, '..', '.hidden', '.backup', backup.folder_name)

lib.base_dir = path.join(__dirname, '..','.hidden' ,'.log')
lib.create = async (filename, data) => {
    let file
    let filepath = path.join(lib.base_dir, `${filename}.log`)
    try{
        file = await fs.appendFileSync(filepath, data)
    }catch(err){
        throw new Error(`Error creating log file: ${filepath}`)
    }
    return data
}
lib.read = async (filename) => {
    let filepath = path.join(lib.base_dir, `${filename}.log`)
    let content = ''
    try{
        content = await fs.readFileSync(filepath, {encoding: 'utf8'})
    }catch(err){
        throw new Error(`Error reading file: ${filepath}`)
    }
    return content
}
lib.list = async () => {
    try{
        let list = await fs.readdirSync(lib.base_dir)
        list = list.map(file => file.replace(/\.log$/, ''))
        // list = await Promise.all(list.map(async file => lib.read(file)))
        return list
    }catch(err){
        throw new Error(`Error reading list in ${lib.base_dir}`)
    }
}
lib.update = async (filename, data) => {
    let filepath = path.join(lib.base_dir, `${filename}.log`)
    let file
    try{
        file = fs.writeFile(filepath, data, (err) => {})
    }catch(err){
        throw new Error(`Error updating ${filepath}`)
    }
    return data
}
lib.delete = async (filename) => {
    let filepath = path.join(lib.base_dir, `${filename}.log`)
    try{
        await fs.unlinkSync(filepath)
    }catch(err){
        throw new Error(`Error deleting file ${filepath}`)
    }
}
lib.createDir = async () => {
    let filesPath = path.join(backup.base_dir)
    try{
        await fs.mkdirSync(filesPath)
    }
    catch(err){
        throw new Error(`Error creating folder:${filesPath}`)
    }
}
// lib.create(`${new Date().getDay()}`, 'TestData')
// lib.update(`${new Date().getDay()}`, 'TestDat')
module.exports = lib