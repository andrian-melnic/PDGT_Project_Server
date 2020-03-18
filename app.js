const express = require('express')
const mongoose = require('mongoose')
const uri = 'mongodb+srv://andry:mCtT80Rs1Dd45SkJ@cluster0-gzywj.mongodb.net/pdgt_project_db?retryWrites=true&w=majority'
const bodyParser = require('body-parser')
const drinkingWater = require('./routes/DrinkingWater')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/drink_water', drinkingWater)

app.get('/', function (req, res) {
  res.send('Hello World!')
})

mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => {
    app.listen(process.env.PORT, process.env.IP, function() {
      console.log('Listening')
    })
  })
  .catch((err) => {
    console.log(err)
  })
