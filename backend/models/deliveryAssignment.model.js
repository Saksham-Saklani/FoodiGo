const mongoose = require('mongoose')

const deliveryAssignmentSchema = new mongoose.Schema({
    order:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    restaurant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant'
    },
    restaurantOrderId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
        
    },
    broadcastedTo:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    deliveryPartner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status:{
        type: String,
        enum: ['broadcasted', 'assigned', 'delivered'],
        default: 'broadcasted'
    },
    acceptedAt: Date

},{timestamps: true})

const DeliveryAssignmentModel= mongoose.model('DeliveryAssignment', deliveryAssignmentSchema)

module.exports = DeliveryAssignmentModel