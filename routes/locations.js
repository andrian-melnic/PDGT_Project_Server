const express = require('express')
const router = express.Router()
const locController = require('../controllers/locations')
const auth = require('../middleware/auth')
const checkOwnership = require('../middleware/checkOwnership')

/* TODO
  - Error handling middleware
  - Add new routes (need ideas)
*/

router.get('/', auth.optional, locController.loc_get)
router.get('/location', auth.optional, locController.loc_getId)
router.post('/new', auth.required, locController.loc_create)
router.put('/location/update',
  auth.required,
  checkOwnership.verifyIDs,
  locController.loc_update)
router.delete('/location/delete',
  auth.required,
  checkOwnership.verifyIDs,
  locController.loc_delete)

module.exports = router
