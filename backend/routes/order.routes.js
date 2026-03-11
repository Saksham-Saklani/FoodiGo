const express = require('express')
const { placeOrder, getMyOrders } = require('../controllers/order.controller')
const auth = require('../middlewares/auth')


const orderRouter = express.Router()

orderRouter.post('/place-order',auth, placeOrder)
orderRouter.get('/my-orders', auth, getMyOrders)

module.exports = orderRouter;