const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocationSchema = new Schema({
  latitude: String,
  lonigtude: String,
  name: String
})

module.exports = mongoose.model('Location', LocationSchema)
