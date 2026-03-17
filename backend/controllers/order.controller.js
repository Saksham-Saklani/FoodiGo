const restaurantModel = require("../models/restaurant.model");
const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");

const placeOrder = async (req, res) => {
  try {
    const { cartItems, deliveryAddress, paymentMethod, totalAmount } = req.body;

    if (!cartItems || cartItems.length == 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res
        .status(400)
        .json({ message: "Please provide complete delivery address" });
    }

    const groupItemsByRestaurant = {};

    cartItems.forEach((item) => {
      const restaurantId = item.restaurant;
      if (!groupItemsByRestaurant[restaurantId]) {
        groupItemsByRestaurant[restaurantId] = [];
      }
      groupItemsByRestaurant[restaurantId].push(item);
    });

    const restaurantOrders = await Promise.all(
      Object.keys(groupItemsByRestaurant).map(async (restaurantId) => {
        const restaurant = await restaurantModel
          .findById(restaurantId)
          .populate("owner");
        if (!restaurant) {
          return res.status(404).json({ message: "Restaurant not found" });
        }

        const items = groupItemsByRestaurant[restaurantId];

        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0,
        );

        return {
          restaurant,
          owner: restaurant.owner,
          subtotal,
          orderItems: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      }),
    );

    const newOrder = await orderModel.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      restaurantOrders,
    });

    await newOrder.populate('restaurantOrders.restaurant', 'name')
    await newOrder.populate('restaurantOrders.orderItems.item', 'name image price')


    res.status(201).json({ message: "Order placed successfully", newOrder });
  } catch (error) {
    res.status(500).json({ message: `place order error: ${error}` });
  }
};

async function getMyOrders(req, res){
  try {

    const user = await userModel.findById(req.userId)

    if(user.role == 'Customer'){
      const orders = await orderModel.find({user: req.userId})
      .sort({createdAt: -1})
      .populate('restaurantOrders.restaurant', 'name image price')
      .populate('restaurantOrders.orderItems.item', 'name image')
      

      return res.status(200).json({orders})
    } else if(user.role == 'Owner'){
      const orders = await orderModel.find({"restaurantOrders.owner": req.userId})
    .sort({createdAt: -1})
    .populate('restaurantOrders.restaurant', 'name image price')
    .populate('restaurantOrders.orderItems.item', 'name image')
    .populate('user')

    const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        user: order.user,
        restaurantOrders: order.restaurantOrders.find((o => o.owner._id == req.userId)),
        createdAt: order.createdAt,
    }))

    return res.status(200).json({filteredOrders})
    }
    
  } catch (error) {
    return res.status(500).json({message: `get my orders error: ${error}`})
  }
}

async function updateOrderStatus(req, res){
    try {
        const {orderId, restaurantId} = req.params
        const { status } =  req.body

        const order = await orderModel.findById(orderId)
        if(!order) return res.status(404).json({message: 'order not found'})

        const shopOrder = order.restaurantOrders.find(r => r.restaurant == restaurantId)  
        if(!shopOrder) return res.status(404).json({message: 'shop order not found'})

        shopOrder.status = status
        await shopOrder.save()
        await order.save()

        res.status(200).json({message: 'order status updated successfully'})
    } catch (error) {
        res.status(500).json({message: `update order status error: ${error}`})
    }
} 





module.exports = {
  placeOrder,
  getMyOrders,
  updateOrderStatus
};
