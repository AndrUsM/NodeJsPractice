let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let mongoose = require('mongoose')

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))

//=============== creating and connecting to mongoose
let dbName = 'todo'
const url = `mongodb://localhost/${dbName}`
mongoose.connect(url,{ useNewUrlParser: true })
//================ set up schema
let todoSchema = new mongoose.Schema({
    name: String
})
let ToDo = mongoose.model("Todo", todoSchema)

//============ Express routes ========
//default
app.get('/', (req, res)=>{
    ToDo.find({}, (err, toDoList)=>{
        if(err) throw err
        else{
            res.render(__dirname + '/views/index.ejs', {toDoList: toDoList})
        }
    })
})
//invalid route
app.get('*', (req, res)=>{
    res.send('<h1>Invalid page</h1>')
})
//post route
app.post('/newtodo', (req,res)=>{
    console.log("Item submited")
    let newitem = ToDo({
        name: req.body.item
    })
    ToDo.create(newitem, (err, data)=>{
        if(err) throw err
        else{
            console.log('Inserted item: ' + newitem)
        }
    })
    res.redirect('./')
})
//deleting item 
app.post('/deletetodo', (req, res)=>{
    console.log('Initialize downloading of last item')
    let deleted = ToDo({
        name: req.body.delItem
    })
    ToDo.deleteOne({'name' : `${deleted.name}`}, (err, success)=>{
        if(err) throw err
        else{
            console.log(success)
        }
    })
    console.log('Last item was deleted')
    res.redirect('./')
})

//=========== Listen ========
app.listen(3000, ()=>{
    console.log(`http://127.0.0.1:3000`)
})
