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
const path = require('path')
require('./config/passport')

const app = express()
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}))
app.use(express.static(path.resolve(__dirname, '../client/build')))
// Routes
app.use('/drink_water', drinkingWater)
app.use('/users', users)

app.get('*', function(req, res){
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})
// Database connection and listening
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(process.env.PORT, function () {
    console.log(`Listening on port ${process.env.PORT}`)
  })
}).catch((err) => {
  console.log(err)
})
