const router = require('express').Router()
const UsersController = require('../controllers/users')
const auth = require('../middleware/auth')
const passport = require('passport')

// POST new user route (optional, everyone has access)
router.post('/register', auth.optional, UsersController.register)

// POST login route (optional, everyone has access)
router.post('/login', auth.optional,
  passport.authenticate('local', { session: false }),
  UsersController.login)

// GET currently logged user (required, accessible only if logged in)
router.get('/current', auth.required, UsersController.current)
module.exports = router
