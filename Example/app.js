const server = require('./lib/server')
const cluster = require('cluster')
const cpus_number = require('os').cpus().length

if(cluster.isMaster){
    //Fork workers
    for(let i = 0; i < cpus_number; i++){
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`)
    })
}else{
    server.run()
}
