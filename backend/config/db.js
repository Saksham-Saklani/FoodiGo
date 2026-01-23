const mongoose = require("mongoose");

async function connectDB() {

    await mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
}

module.exports = connectDB;