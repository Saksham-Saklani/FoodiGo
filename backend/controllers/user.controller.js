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

module.exports = {
    getCurrentUser
}