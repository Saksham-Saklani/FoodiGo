const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db.js');
const authRouter = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.routes');
const itemRouter = require('./routes/item.routes')
const restaurantRouter = require('./routes/restaurant.routes')
const cors = require('cors');

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5001",
    credentials: true
}))
app.use('/api/auth', authRouter)
app.use('/api/user',userRouter)
app.use('/api/restaurant', restaurantRouter)
app.use('/api/item', itemRouter)

app.listen(process.env.PORT , () => {
    connectDB();
    console.log("server is running on port:", process.env.PORT);
})



