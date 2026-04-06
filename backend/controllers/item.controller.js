const uploadOnCloudinary = require('../utils/cloudinary')
const restaurantModel = require('../models/restaurant.model')
const itemModel = require('../models/item.model')
const { options } = require('../routes/order.routes')

async function addItem(req, res){
    try {
        const { name, price, category, foodType } = req.body

        let image
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }

        let restaurant = await restaurantModel.findOne({owner: req.userId}).populate(
            {
                path: 'items',
                options:{
                    sort:{createdAt: -1}
                }
            }
        )

        if(!restaurant){
            return res.status(404).json({message: "Restaurant not found"})
        }

        let item = await itemModel.create({
            name,
            price,
            category,
            foodType,
            image,
            restaurant: restaurant._id
        })
        restaurant.items.push(item._id)
        await restaurant.save()
        await restaurant.populate(
            {
                path: 'items',
                options:{
                    sort:{createdAt: -1}
                }
            }
        )

        return res.status(201).json({message: 'Item added successfully', restaurant})

    } catch (error) {
        return res.status(500).json({message: 'Error adding item', error})
    }
}

async function editItem(req, res){
    try {
        const itemId= req.params.itemId
        const { name, price, category, foodType } = req.body
        let image
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }

        let item = await itemModel.findByIdAndUpdate(itemId,{
            name,
            price,
            category,
            foodType,
            image,
        },{new: true})

        if(!item){
            return res.status(404).json({message: 'Item not found'})
        }

        const restaurant = await restaurantModel.findOne({owner: req.userId}).populate(
            {
                path: 'items',
                options:{
                    sort:{createdAt: -1}
                }
            }
        )

        return res.status(200).json({message: 'Item updated successfully', restaurant})
    } catch (error) {
        return res.status(500).json({message: 'Error updating item', error})
    }
}

async function getItemById(req, res){
    try {
        const itemId = req.params.itemId
        const item = await itemModel.findById(itemId)

        if(!item){
            return res.status(404).json({message: 'Item not found'})
        }

        return res.status(200).json({message: 'Item fetched successfully', item})
    } catch (error) {
        return res.status(500).json({message: 'Error fetching item', error})
    }
}

async function deleteItem(req, res){
    try {
        const itemId = req.params.itemId
        const item = await itemModel.findByIdAndDelete(itemId)

        if(!item){
            return res.status(404).json({message: 'Item not found'})
        }

        const restaurant = await restaurantModel.findOne({owner: req.userId})
        restaurant.items.pull(item._id)
        await restaurant.save()
        await restaurant.populate(
            {
                path: 'items',
                options:{
                    sort:{createdAt: -1}
                }
            }
        )

        return res.status(200).json({message: 'Item deleted successfully', restaurant})
    } catch (error) {
        return res.status(500).json({message: 'Error deleting item', error})
    }
}

async function getItemsByRestaurant(req, res) {
    try {
        const {restaurantId} = req.params

        const restaurant = await restaurantModel.findById(restaurantId)
        .populate("items")

        if(!restaurant) return res.status(400).json({message: "restaurant not found"})

            return res.status(200).json({message: "items fetched successfully", restaurant, items: restaurant.items})
    } catch (error) {
        return res.status(500).json({message: "Error fetching items", error})
    }
}

async function searchItems(req, res){

    try {
        const { query, city } = req.query

        if(!query || !city){
        return res.status(400).json({message: "Query and city are required"})
    }

    const restaurants = await restaurantModel.find({city: {$regex: new RegExp(`^${city}$`, 'i')}})
    .populate('items')

    const restaurantIds = restaurants.map(rest => rest._id)

    const items = await itemModel.find({
        restaurant: {$in: restaurantIds},
        $or: [
            {name: {$regex:query, $options: 'i' }},
            {category: {$regex: query, $options: 'i'}}
        ]
    }).populate('restaurant', 'name image')

        return res.status(200).json(items)
    } catch (error) {
        return res.status(500).json({message: "Error searching items", error})
    }
    
}


module.exports = { 
    addItem, 
    editItem, 
    getItemById, 
    deleteItem, 
    getItemsByRestaurant, 
    searchItems 
}