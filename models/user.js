const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema

const UsersSchema = new Schema({
  email: {
    type: String,
    require: true
  },

  hash: String,

  salt: String,

  // User' s favorite drinking water positions
  favLocations: [{
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }],

  // Drinking water positions added by the user
  createdLocations: [{
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }]
})

UsersSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(
    password, this.salt,
    10000,
    512,
    'sha512').toString('hex')
}

UsersSchema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    10000,
    512,
    'sha512').toString('hex')
  return this.hash === hash
}

UsersSchema.methods.generateJWT = function () {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign({
    id: this._id,
    email: this.email
  }, 'secret', { expiresIn: '1h' })
}

UsersSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    email: this.email,
    token: this.generateJWT()
  }
}

module.exports = mongoose.model('User', UsersSchema)
