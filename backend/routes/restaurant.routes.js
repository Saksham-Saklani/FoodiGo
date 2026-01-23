const express = require('express')
const upload = require('../middlewares/multer')
const { createEditRestaurant, getMyRestaurant, getMyCityRestaurants } = require('../controllers/restaurant.controller')
const auth = require('../middlewares/auth')

const restaurantRouter = express.Router()

restaurantRouter.post('/create-edit', auth, upload.single('image'),createEditRestaurant)
restaurantRouter.get('/my-restaurant', auth, getMyRestaurant)
restaurantRouter.get('/:city',auth, getMyCityRestaurants)

module.exports = restaurantRouter