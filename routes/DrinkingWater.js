const express = require('express')
const router = express.Router()
const Location = require('../models/DrinkingWaterLocation')

router.get('/', async(req, res) => {
  try{
    const drinkingWaterLocs = await (Location.find({}))
    res.send(drinkingWaterLocs)
  } catch(err) {
    console.log(err)
  }
})
router.get('/:id', async(req, res) => {
  try{
    const drinkingWaterLoc = await (Location.findById(req.params.id))
    res.send(drinkingWaterLoc)
  } catch(err) {
    console.log(err)
  }
})

module.exports = router
