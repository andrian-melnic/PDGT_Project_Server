
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local')
const passport = require('passport')

const Users = mongoose.model('User')
passport.use(new LocalStrategy(
  {
    usernameField: 'user[email]',
    passwordField: 'user[password]'
  }, (email, password, done) => {
    Users.findOne({ email }, (err, user) => {
      if (err) {
        return done(err)
      }
      if (!user || !user.validatePassword(password)) {
        return done(null, false)
      }
      return done(null, user)
    })
  }
))
