const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocationSchema = new Schema({
  latitude: String,
  lonigtude: String,
  name: String,
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Location', LocationSchema)
