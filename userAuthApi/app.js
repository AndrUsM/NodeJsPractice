const express = require('express')
const app = express()
const db = require('./lib/db')
const UserController = require('./lib/UserController')
app.use('/users', UserController)
module.exports = app