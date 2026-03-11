const mongoose = require('mongoose')

const orderItemSchema = mongoose.Schema({
    Item:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    Name: String,
    price: Number,
    quantity: Number
},{timestamps:true})

const restaurantOrderSchema= new mongoose.Schema({
    restaurant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant'
    },
    subtotal:Number,
    orderItem:[orderItemSchema]
},{timestamps:true})

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    paymentMethod:{
        type:String,
        enum: ['COD', 'Online'],
        required:true
    },
    deliveryAddress:{
        type: String,
        longitude:Number,
        latitude:Number
    },
    totalAmount: Number,
    restaurantOrder:[restaurantOrderSchema]

},{timestamps:true})

const orderModel = mongoose.model('Order', orderSchema)

module.exports = orderModel