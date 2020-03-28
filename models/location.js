const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocationSchema = new Schema({
  lat: String,
  lng: String,
  comune: String,
  provincia: String,
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Location', LocationSchema)
