const Location = require('../models/Location')
const User = require('../models/User')
exports.loc_get = async (req, res) => {
  // GET all drinking water fountains
  try {
    const drinkingWaterLocs = await (Location.find({}))
    res.send(drinkingWaterLocs)
  } catch (err) {
    console.log(err)
  }
}

// GET a drinking water fountain by specifying the ID
exports.loc_getId = async (req, res) => {
  try {
    const drinkingWaterLoc = await (Location.findById(req.params.id))
    res.send(drinkingWaterLoc)
  } catch (err) {
    console.log(err)
  }
}

// Add a new drinking water fountain
exports.loc_create = async (req, res) => {
  const { payload: { id } } = req
  const location = new Location({
    latitude: req.body.latitude,
    longitude: req.body.latitude,
    name: req.body.latitude,
    addedBy: id
  })
  try {
    const addedDrinkingWaterLoc = await (location.save())
    const creator = await User.findById(id)
    res.json(addedDrinkingWaterLoc)
    creator.createdLocations.push(location)
    await creator.save()
  } catch (err) {
    console.log(err)
  }
}

// Edit a location with a specific ID
exports.loc_update = async (req, res) => {
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
}

// Delete a location with a specific ID
exports.loc_delete = async (req, res) => {
  try {
    const deletedLocation = await (Location.findByIdAndRemove(req.params.id))
    res.send('Deleted: ' + deletedLocation)
  } catch (err) {
    console.log(err)
  }
}
