const fs = require('fs')
const path = require('path')
const jokes = {}
jokes.allJokes = () => {
    let data = fs.readFileSync(path.join(__dirname, '.data' ,'comment.dat'), 'utf8')
    let fileContent = data
    let arrayOfJokes = fileContent.split(/\r?\n/)
    return arrayOfJokes
}
module.exports = jokes