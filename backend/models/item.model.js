const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        min: 0,
        required: true,
    },
    restaurant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant'
    },
    category:{
        type: String,
        Enum: [
            'Main Course',
            'Snacks',
            'Dessert',
            'Chinese',
            'South Indian',
            'North Indian',
            'Chinese',
            'Pizza',
            'Burger',
            'Sandwich',
            'Salad',
            'Soup',
            'Drink',
            'Other'
        ],
    },
    foodType:{
        type: String,
        Enum: [
            'Veg',
            'Non-Veg'
        ],
    },
    rating:{
        average:{
            type: Number,
            default: 0
        },
        count:{
            type: Number,
            default:0
        }
    }
},{timestamps: true})

const itemModel = mongoose.model('Item', itemSchema)

module.exports = itemModel