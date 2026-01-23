const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }]
},{timeStamps: true})

const restaurantModel = mongoose.model('restaurant',restaurantSchema)

module.exports = restaurantModel