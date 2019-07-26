const mathlib = require('./jokesLib/math')
const jokeslib = require('./jokesLib/joke_main')

const app = {}
app.config = { timeBeetweenJokes: 1000 }

app.print = () => {
    let allJokes = jokeslib.allJokes()
    let numberOfJokes = allJokes.length
    let randomNumber = mathlib.getRandomNumber(1, numberOfJokes)
    let selectedJokes = allJokes[randomNumber - 1]
    console.log(selectedJokes)
}
app.test = () => {
    setInterval(app.print, app.config.timeBeetweenJokes)
}
module.exports = app