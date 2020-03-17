const express = require('express')
const mongoose = require('mongoose')
const uri = `mongodb+srv://${
  process.env.MONGO_USR}:${
  process.env.MONGO_PWD}@cluster0-gzywj.mongodb.net/${
  process.env.MONGO_DB}?retryWrites=true&w=majority`
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => {
    app.listen(3000)
  })
  .catch((err) => {
    console.log(err)
  })
