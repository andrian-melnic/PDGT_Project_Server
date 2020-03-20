const User = require('../models/User')
const passport = require('passport')

exports.register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.user.email })
    if (existingUser) {
      throw new Error('User exits already')
    }
    const { body: { user } } = req
    const finalUser = new User(user)

    finalUser.setPassword(user.password)

    const newUser = await finalUser.save()
    return res.json({
      user: newUser.toAuthJSON()
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

exports.login = (req, res, next) => {
  return passport.authenticate(
    'local',
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err)
      }

      if (passportUser) {
        const user = passportUser
        user.token = passportUser.generateJWT()

        return res.json({ user: user.toAuthJSON() })
      }

      return status(400).info
    })(req, res, next)
}

exports.current = async (req, res) => {
  const { payload: { id } } = req
  try {
    const currentUser = await User.findById(id)
    if (!currentUser) {
      return res.sendStatus(400)
    }
    return res.json({ user: currentUser.toAuthJSON() })
  } catch (error) {
    console.log(error)
  }
}
