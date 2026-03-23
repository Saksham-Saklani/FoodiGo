const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
        required: true,
    },
    role:{
        type: String, 
        enum: ['Customer', 'Owner', 'Delivery Partner'],
        required: true
    },
    otp:{
        type: Number,
    },
    isOtpVerified:{
        type: Boolean,
        default: false,
    },
    otpExpiry:{
        type: Date,
    },
    location:{
        type:{type: String, enum: ['Point'], default: 'Point'},
        coordinates:{
            type:[Number],
            default: [0,0]
        }
    }
},{
    timestamps: true
});


userSchema.index({location: '2dsphere'})
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;