const workers = {}
const path = require('path')
const fs = require('fs')
const _log = require('./log')
const os = require('os')
const backup = {}

workers.filename = `${new Date().getUTCFullYear()}.${new Date().getUTCMonth()}.${new Date().getUTCDate()}.${new Date().getUTCHours()}:${new Date().getUTCMinutes()}:${new Date().getUTCSeconds()}:${new Date().getUTCMilliseconds()}`
backup.folder_name = `${new Date().getUTCFullYear()}.${new Date().getUTCMonth()}.${new Date().getUTCDate()}`

workers.create_log = async (handlers_data) => {
    let str = ''
    try{
        let out_geolocation_data = 
        exec('curl ipinfo.io', (err, stdout, stderr) => {
            if(err) console.error(err)
            out_geolocation_data = `${JSON.stringify(stdout)}\n${JSON.stringify(stderr)}` 
        })

        let server_info = `Server work on ${os.platform()}:${os.type()}:${os.arch()}`
        let site_info = `Hostname: ${os.hostname}`
        let pc_info = `Server PC Info: ${JSON.stringify(os.userInfo())}`
        let cpus_process = `CPU Processes: ${JSON.stringify(os.cpus())}`
        let logs = `${handlers_data}`
        let network_data = `Network: ${JSON.stringify(network_interfaces)}`
        let current_time = `Time: ${new Date().getUTCFullYear()}.${new Date().getUTCMonth()}.${new Date().getUTCDate()}.${new Date().getUTCHours()}:${new Date().getUTCMinutes()}:${new Date().getUTCSeconds()}:${new Date().getUTCMilliseconds()}`
        let geolocation = `Geolocation: ${JSON.stringify(out_geolocation_data)}`
        // Log data
        str += `${server_info}\n${site_info}\n${pc_info}\n${cpus_process}\nLogs\n${logs}\n${network_data}\n${current_time}\n${geolocation}`
        // Log data
        await _log.create(workers.filename, str)
    }catch(err){
        throw new Error(`Error creating log ${filename}.log`)
    }
    return str
}
workers.loop = async (data) => {
    setInterval( () => {
        workers.create_log(data)
    }, 1000 * 60) // 1 min
}
workers.back_up = async () => {
    _log.createDir()
    let current_path = path.join(__dirname, '..', '.hidden','.log')
    let new_path = path.join(__dirname, '..', '.hidden','.backup', backup.folder_name)
    let list = await _log.list()
    const files_amaunt = list.length
    try{
        let current_file_counter = 0
        list.map(file => {
            fs.renameSync(path.join(current_path, `${file}.log`), path.join(new_path, `${file}.log`))
            current_file_counter++
            console.log(`${current_file_counter}/${files_amaunt}`)
        })
    }catch(err){
        throw new Error(`Error moving files to ${new_path} folder`)
    }
}
workers.loop = async (data) => {
    setInterval( () => {
        workers.create_log(data)
    }, 1000 * 60) // 1 min
}
workers.back_up = async () => {
    _log.createDir()
    let current_path = path.join(__dirname, '..', '.hidden','.log')
    let new_path = path.join(__dirname, '..', '.hidden','.backup', backup.folder_name)
    let list = await _log.list()
    const files_amaunt = list.length
    try{
        let current_file_counter = 0
        list.map(file => {
            fs.renameSync(path.join(current_path, `${file}.log`), path.join(new_path, `${file}.log`))
            current_file_counter++
            console.log(`${current_file_counter}/${files_amaunt}`)
        })
    }catch(err){
        throw new Error(`Error moving files to ${new_path} folder`)
    }
}
workers.delete_old = async () => {
    try{
        workers.back_up()
        console.log(`Logs successfuly backuped`)
        return
    }
    catch(err){
        let list = await _log.list()
        try{
            if(!list){
                throw new Error(`Error getting list`)
            }
            list.map(item => {
                _log.delete(item)
            })
        }catch(err){
            throw new Error(`Error deleting files`)
        }
    }
}
workers.rotate = async () => {
    setInterval(() => {
        console.log('Time for back up logs')
        workers.delete_old()
    }, 1000 * 60 * 60 * 24) // One day
}
workers.init = () => {
    workers.rotate()
}
module.exports = workers
