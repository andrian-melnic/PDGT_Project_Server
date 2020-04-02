const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocationSchema = new Schema({
  lng: String,
  lat: String,
  address: String,
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Location', LocationSchema)
