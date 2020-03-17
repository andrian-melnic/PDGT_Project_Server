const express = require('express')
const router = express.Router()
const Location = require('../models/DrinkingWaterLocation')

/* TODO
  - Refactor: separate routes from controllers
  - Error handling middleware
  - Add new routes (need ideas)
*/
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

// Edit a location with a specific ID
router.put('/update/:id', async (req, res) => {
  const newData = req.body
  console.log(newData)
  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      { $set: newData }
    )
    res.send('Location ' + updatedLocation + 'updated in:' + newData)
  } catch (error) {
    console.log(error)
  }
})

// Delete a location with a specific ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedLocation = await (Location.findByIdAndRemove(req.params.id))
    res.send('Deleted: ' + deletedLocation)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router

