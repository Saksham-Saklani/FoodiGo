const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  },
  { timestamps: true },
);

const restaurantOrderSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
    },
    owner:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subtotal: Number,
    status:{
        type: String,
        enum: ["Pending", "Preparing", "Out for Delivery", "Delivered"],
        default: "Pending"
    },
    assignment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryAssignment',
        default:null
    },
    assignedDeliveryPartner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderItems: [orderItemSchema],
       otp:{
        type: Number,
        default: null
    },
    otpExpiry:{
        type: Date,
        default: null
    },
    deliveredAt:{
      type: Date,
      default: null
    }
  },
  { timestamps: true },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      required: true,
    },
    deliveryAddress: {
      text: String,
      longitude: Number,
      latitude: Number,
    },
    totalAmount: Number,
    restaurantOrders: [restaurantOrderSchema],

    payment:{
      type:Boolean,
      default:false
    },
    razorpayOrderId:{
      type:String,
      default:""
    },
    razorpayPaymentId:{
      type:String,
      default:""
    },
  },
  { timestamps: true },
);

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
