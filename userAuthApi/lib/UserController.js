const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = require('../app')
router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

const User = require('./User')

router.post('/', function (req, res) {
    User.create({
            name : req.baseUrl.name,
            email : req.body.email,
            password : req.body.password
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if(err) return res.status(500)
        .send("There was a problem finding the users.")
        res.status(200).send(users)
    })
})

router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        res.status(200).send(`User ${user.name} was deleted.`)
    })
})
router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true},
        (err, user) => {
            if(err) return res.status(500).send('There was a problem updating the user.')
            res.status(200).send(user)
        })
})
module.exports = router