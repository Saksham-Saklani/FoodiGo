const express = require('express')
const { placeOrder, getMyOrders, updateOrderStatus, getDeliveryPartnerAssignments, acceptDeliveryAssignment, getCurrentOrder, getOrderById , sendDeliveryOtp, verifyDeliveryOtp, verifyPayment, getTodayDeliveries} = require('../controllers/order.controller')
const auth = require('../middlewares/auth')



const orderRouter = express.Router()

orderRouter.post('/place-order',auth, placeOrder)
orderRouter.get('/my-orders', auth, getMyOrders)
orderRouter.get('/get-orders', auth, getDeliveryPartnerAssignments)
orderRouter.get('/get-current-order', auth, getCurrentOrder)
orderRouter.post('/send-delivery-otp', auth, sendDeliveryOtp)
orderRouter.post('/verify-delivery-otp', auth, verifyDeliveryOtp)
orderRouter.get('/get-order-by-id/:orderId', auth, getOrderById)
orderRouter.get('/accept-order/:assignmentId', auth, acceptDeliveryAssignment)
orderRouter.post('/update-status/:orderId/:restaurantId', auth, updateOrderStatus)
orderRouter.post('/verify-payment', auth, verifyPayment)
orderRouter.get('/get-today-deliveries', auth, getTodayDeliveries)



module.exports = orderRouter;