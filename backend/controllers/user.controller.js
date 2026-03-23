const userModel = require('../models/user.model')

async function getCurrentUser(req, res){
    try{
        const userId = req.userId

        if(!userId){
            return res.status(401).json({message: 'Unauthorized: No user ID found'})
        }
        const user = await userModel.findById(userId)

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        return res.status(200).json({user})
    }catch(error){
        return res.status(500).json({message: 'Error fetching user'})  
    }
}

async function updateUserLocation(req,res){
    try {
        const {lat,lon} = req.body
        const user = await userModel.findByIdAndUpdate(req.userId, {
            location:{
                type: 'Point',
                coordinates: [lon, lat]
            }
        },{new: true})

        res.status(200).json({message: 'Location updated successfully'})
    } catch (error) {
        res.status(500).json({message: `Update location error: ${error}`})
    }
}

module.exports = {
    getCurrentUser,
    updateUserLocation
}