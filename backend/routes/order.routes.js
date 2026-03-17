const express = require('express')
const { placeOrder, getMyOrders, updateOrderStatus } = require('../controllers/order.controller')
const auth = require('../middlewares/auth')


const orderRouter = express.Router()

orderRouter.post('/place-order',auth, placeOrder)
orderRouter.get('/my-orders', auth, getMyOrders)
orderRouter.post('/update-status/:orderId/:restaurantId', auth, updateOrderStatus)

module.exports = orderRouter;