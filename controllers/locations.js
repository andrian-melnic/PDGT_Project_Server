const Location = require('../models/location')
const User = require('../models/user')
const axios = require('axios')

async function reverseGeocode (coordinates) {
  try {
    const query = 'https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' +
                  `${coordinates.lat}&lon=${coordinates.lng}`
    const response = await axios.get(query)

    const resData = response.data.features[0]

    const address = resData.properties.display_name
    return { address: address }
  } catch (err) {
    console.log(err)
  }
}
exports.loc_get = async (req, res) => {
  // GET all drinking water fountains
  try {
    const drinkingWaterLocs = await (Location.find({}))
    res.send(drinkingWaterLocs)
  } catch (err) {
    console.log(err)
  }
}

// GET a drinking water location by specifying the ID
exports.loc_getId = async (req, res) => {
  try {
    const drinkingWaterLoc = await (Location.findById(req.params.id))
    res.send(drinkingWaterLoc)
  } catch (err) {
    console.log(err)
  }
}

// Add a new drinking water location
exports.loc_create = async (req, res) => {
  const { payload: { id } } = req
  try {
    const revGeoData = await reverseGeocode({
      lat: req.body.latitude,
      lng: req.body.longitude
    })
    const location = new Location({
      lat: req.body.latitude,
      lng: req.body.longitude,
      address: revGeoData.address,
      addedBy: id
    })
    const addedDrinkingWaterLoc = await (location.save())
    const creator = await User.findById(id)
    res.json(addedDrinkingWaterLoc)
    creator.createdLocations.push(location)
    await creator.save()
  } catch (err) {
    res.json({
      error: err.message
    })
    console.log(err)
  }
}

// Edit a location with a specific ID
exports.loc_update = async (req, res) => {
  const revGeoData = await reverseGeocode({
    lat: req.body.latitude,
    lng: req.body.longitude
  })
  const updatedData = {
    lat: req.body.latitude,
    lng: req.body.longitude,
    address: revGeoData.address
  }
  console.log(updatedData)
  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData }
    )
    res.send('Location ' + updatedLocation + 'updated in:' + updatedData)
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
