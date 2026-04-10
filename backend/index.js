const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db.js');
const authRouter = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.routes');
const itemRouter = require('./routes/item.routes')
const restaurantRouter = require('./routes/restaurant.routes')
const orderRouter = require('./routes/order.routes')
const cors = require('cors');
const http = require('http')
const { Server } = require('socket.io')
const socketHandler = require('./socket')

const app = express();
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin: "https://foodigo-mern.onrender.com",
        credentials: true,
        methods: ["GET", "POST"]
    }
})

app.set("io", io)

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://foodigo-mern.onrender.com",
    credentials: true
}))
app.use('/api/auth', authRouter)
app.use('/api/user',userRouter)
app.use('/api/restaurant', restaurantRouter)
app.use('/api/item', itemRouter)
app.use('/api/order',orderRouter)

socketHandler(io)

server.listen(process.env.PORT , () => {
    connectDB();
    console.log("server is running on port:", process.env.PORT);
})



