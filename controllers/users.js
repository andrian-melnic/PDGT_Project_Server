const User = require('../models/user')
/*
  TODO
  ---> Need to check if user exists
  ---> Better error handling
*/
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
    return res.json({user: {
      "email":newUser.email,
      "id": newUser.id
    }})
  } catch (error) {
    console.log(error)
    res.json({
      error: error.message
    })
  }
}
exports.login = (req, res) => {
  const user = req.user
  user.token = req.user.generateJWT()
  return res.json({ user: user.toAuthJSON() })
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
    res.json(error)
  }
}
