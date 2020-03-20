const express = require('express')
const mongoose = require('mongoose')
const uri = 'mongodb+srv://andry:mCtT80Rs1Dd45SkJ@cluster0-gzywj.mongodb.net/pdgt_project_db?retryWrites=true&w=majority'
const bodyParser = require('body-parser')
const session = require('express-session')
const drinkingWater = require('./routes/locations')
const users = require('./routes/users')
require('./config/passport')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}))

// Routes
app.get('/', function (req, res) {
  res.send('Hello World!')
})
app.use('/drink_water', drinkingWater)
app.use('/users', users)

// Database connection and listening
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(3000, function () {
    console.log('Listening')
  })
}).catch((err) => {
  console.log(err)
})
