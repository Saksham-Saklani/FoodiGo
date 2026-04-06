const express = require('express')
const upload = require('../middlewares/multer')
const auth = require('../middlewares/auth')
const { addItem, editItem, getItemById, deleteItem, getItemsByRestaurant, searchItems } = require('../controllers/item.controller')

const itemRouter = express.Router()

itemRouter.post('/add', auth, upload.single('image'), addItem)
itemRouter.post('/edit/:itemId', auth, upload.single('image'), editItem)
itemRouter.get('/get/:itemId', auth, getItemById)
itemRouter.delete('/delete/:itemId', auth, deleteItem)
itemRouter.get('/get-restaurant-items/:restaurantId', auth, getItemsByRestaurant)
itemRouter.get('/search-items', auth, searchItems)


module.exports = itemRouter