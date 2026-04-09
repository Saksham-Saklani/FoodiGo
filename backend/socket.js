
const userModel = require('./models/user.model')

function socketHandler(io){
    io.on('connection', (socket) => {
        socket.on('identity', async({userId}) => {
            try {
                const user = await userModel.findByIdAndUpdate(userId,{
                socketId: socket.id,
                isActive: true
            },{new:true})   
            } catch (error) {
                console.log('Error in updating user identity:', error)
            }   
        })

        socket.on('disconnect', async() => {
            try {
                const user = await userModel.findOneAndUpdate({socketId: socket.id},{
                    socketId: null,
                    isActive: false
                },{new:true})
            } catch (error) {
                console.log('Error in disconnecting user:', error)
            }
        })

        socket.on('updateLocation', async({latitude, longitude, userId}) => {
            try {
                const user = await userModel.findByIdAndUpdate(userId,{
                    location:{
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    isActive: true,
                    socketId: socket.id
                })

                if(user){
                    io.emit('deliveryLocation',{
                        deliveryPartnerId: userId,
                        latitude,
                        longitude
                    })
                }
            } catch (error) {
                console.log('Error in updating user location:', error)
            }
        })
    })
}

module.exports = socketHandler