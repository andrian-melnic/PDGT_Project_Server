const express = require('express')
const router = express.Router()
const locController = require('../controllers/locations')

/* TODO
  - Error handling middleware
  - Add new routes (need ideas)
*/

router.get('/', locController.loc_get)
router.get('/:id', locController.loc_getId)
router.post('/new', locController.loc_create)
router.put('/update/:id', locController.loc_update)
router.delete('/delete/:id', locController.loc_delete)

module.exports = router
