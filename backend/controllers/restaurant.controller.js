const restaurantModel = require('../models/restaurant.model')
const uploadOnCloudinary = require('../utils/cloudinary')

async function createEditRestaurant(req, res){
    try {
        const { name, city, state, address } = req.body
        let image
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }
        let restaurant = await restaurantModel.findOne({owner: req.userId})

        if (!restaurant) {
             restaurant = await restaurantModel.create({
                name,
                image,
                city,
                state,
                address,
                owner: req.userId
            })
        } else {
            restaurant = await restaurantModel.findByIdAndUpdate((restaurant._id),{
                name,
                image,
                city,
                state,
                address,
                owner: req.userId
            },{new: true})
        }
            await restaurant.populate([
                { path: 'owner' },
                {
                    path: 'items',
                    options:{
                        sort:{createdAt: -1}
                    }
                }
            ]);
            res.status(201).json({message:"Restaurant created/updated successfully", restaurant})
    } catch (error) {
        res.status(500).json({message: "Error creating/updating restaurant", error: error.message || error})
    }
}

async function getMyRestaurant(req, res){
    try {
        const restaurant = await restaurantModel.findOne({owner: req.userId}).populate(
            {
                path: 'items',
                options:{
                    sort:{createdAt: -1}
                }
            }
        )
        if(!restaurant){
            return null
        }
        return res.status(200).json({restaurant})
    } catch (error) {
        return res.status(500).json({message: "Error fetching restaurant",error})
    }
}

async function getMyCityRestaurants(req, res){
    try {
       const { city } = req.params
   
       if(!city){
           return res.status(400).json({message: 'City is required'})
       }
   
       const restaurants = await restaurantModel.find({city: {$regex: new RegExp(`^${city}$`, 'i')}}).populate('items')
   
       return res.status(200).json({message: 'Restaurants fetched successfully', restaurants})
   
      
    } catch (error) {
       return res.status(500).json({message: 'Error fetching restaurants', error})
    }
   }

module.exports = {createEditRestaurant, getMyRestaurant, getMyCityRestaurants}