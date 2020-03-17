const express = require('express')
const router = express.Router()
const Location = require('../models/DrinkingWaterLocation')

router.get('/', async(req, res) => {
  // GET all drinking water fountains
  try{
    const drinkingWaterLocs = await (Location.find({}))
    res.send(drinkingWaterLocs)
  } catch(err) {
    console.log(err)
  }
})

// GET a drinking water fountain by specifying the ID
router.get('/:id', async(req, res) => {
  try{
    const drinkingWaterLoc = await (Location.findById(req.params.id))
    res.send(drinkingWaterLoc)
  } catch(err) {
    console.log(err)
  }
})

// Add a new drinking water fountain
router.post('/new', async(req, res) => {
  const location = new Location(req.body)
  try{
    const addedDrinkingWaterLoc = await (location.save())
    res.json(addedDrinkingWaterLoc)
  } catch(err) {
    console.log(err)
  }
})

module.exports = router
