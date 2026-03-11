const placeOrder = async (req, res) => {
    try{
        const { cartItems, deliveryAddress, paymentMethod } = req.body

        if(!cartItems || cartItems.length == 0 ){
            return res.status(400).json({message: "Cart is empty"})
        }

        if(deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude){
            return res.status(400).json({message: "Please provide complete delivery address"})
        }

       const groupItemsByRestaurant = {}

       cartItems.forEach(item => {
        const restaurantId = item.restaurant
        if(!groupItemsByRestaurant[restaurantId]){
            groupItemsByRestaurant[restaurantId] = []
        }
        groupItemsByRestaurant[restaurantId].push(item)
       })

       const shopOrders = await Object.keys(groupItemsByRestaurant)

       shopOrders.map(async(restaurantId) => {
        const restaurant = await restaurantModel.findById(restaurantId).populate('User')
        if(!restaurant){
            return res.status(404).json({message: "Restaurant not found"})
        }

        const items = groupItemsByRestaurant[restaurantId]

        const subtotal = items.reduce((sum, i) => sum + Number(i.price)*Number(i.quantity),0)

       })
        
    }catch(error){
        
    }
}