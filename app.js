const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const uri = `mongodb+srv://${process.env.DB_USER}` +
              `:${process.env.DB_PASSWORD}` +
              `@${process.env.DB_HOST}` +
              `/${process.env.DB_NAME}?retryWrites=true&w=majority`
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
