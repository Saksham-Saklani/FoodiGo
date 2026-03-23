const express = require('express')
const { getCurrentUser, updateUserLocation } = require('../controllers/user.controller')
const auth = require('../middlewares/auth')

const userRouter = express.Router()

userRouter.get('/current', auth, getCurrentUser)
userRouter.post('/update-location', auth, updateUserLocation)

module.exports = userRouter