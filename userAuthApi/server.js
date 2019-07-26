const app = require('./app')
const port = process.env.NODE_ENV || 3000

const ngrok = require('ngrok');
(async function() {
  const url = await ngrok.connect();
})();

const cors = require('cors');
const bodyParser = require('body-parser')
app.use(bodyParser.text())
app.use(cors());

app.use(cors({
    origin: 'http://127.0.0.1:4200'
  }));


const server = app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
})