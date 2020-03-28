const Location = require('../models/Location')
const User = require('../models/User')
const axios = require('axios')

async function reverseGeocode (coordinates) {
  try {
    const query = 'https://maps.googleapis.com/maps/api/geocode/json?' +
                  `latlng=${coordinates.lat},${coordinates.lng}` +
                  `&key=${process.env.GOOGLE_MAPS_API_KEY}` +
                  '&result_type=administrative_area_level_3'

    const response = await axios.get(query)

    const resData = response.data.results[0]
    const comune = resData.address_components[0].long_name
    const provincia = resData.address_components[1].short_name
    return { comune: comune, provincia: provincia }
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
      comune: revGeoData.comune,
      provincia: revGeoData.provincia,
      addedBy: id
    })
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
