const restaurantModel = require("../models/restaurant.model");
const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
const DeliveryAssignmentModel = require("../models/deliveryAssignment.model");
const { sendDeliveryOtpMail } = require("../utils/mail");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    if (paymentMethod == "Online") {
      const razorpayOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      const newOrder = await orderModel.create({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        restaurantOrders,
        razorpayOrderId: razorpayOrder.id,
        payment: false,
      });

      return res.status(200).json({
        razorpayOrder,
        orderId: newOrder._id,
      });
    }

    const newOrder = await orderModel.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      restaurantOrders,
    });

    await newOrder.populate("restaurantOrders.restaurant", "name");
    await newOrder.populate(
      "restaurantOrders.orderItems.item",
      "name image price",
    );
    await newOrder.populate("restaurantOrders.owner", "fullname socketId");
    await newOrder.populate("user");

    const io = req.app.get("io");

    if (io) {
      newOrder.restaurantOrders.forEach((restaurantOrder) => {
        const ownerSocketId = restaurantOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: newOrder._id,
            paymentMethod: newOrder.paymentMethod,
            deliveryAddress: newOrder.deliveryAddress,
            user: newOrder.user,
            restaurantOrders: restaurantOrder,
            payment: newOrder.payment,
            createdAt: newOrder.createdAt,
          });
        }
      });
    }

    res.status(201).json({ message: "Order placed successfully", newOrder });
  } catch (error) {
    res.status(500).json({ message: `place order error: ${error}` });
  }
};

async function getMyOrders(req, res) {
  try {
    const user = await userModel.findById(req.userId);

    if (user.role == "Customer") {
      const orders = await orderModel
        .find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("restaurantOrders.restaurant", "name image price")
        .populate("restaurantOrders.orderItems.item", "name image");

      return res.status(200).json({ orders });
    } else if (user.role == "Owner") {
      const orders = await orderModel
        .find({ "restaurantOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("restaurantOrders.restaurant", "name image price")
        .populate("restaurantOrders.orderItems.item", "name image")
        .populate("user")
        .populate(
          "restaurantOrders.assignedDeliveryPartner",
          "fullname email mobile",
        );

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        user: order.user,
        restaurantOrders: order.restaurantOrders.find(
          (o) => o.owner._id == req.userId,
        ),
        payment: order.payment,
        createdAt: order.createdAt,
      }));

      return res.status(200).json({ filteredOrders });
    }
  } catch (error) {
    return res.status(500).json({ message: `get my orders error: ${error}` });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { orderId, restaurantId } = req.params;
    const { status } = req.body;

    let deliveryPartnersPayload = [];

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "order not found" });

    const restaurantOrder = order.restaurantOrders.find(
      (r) => r.restaurant == restaurantId,
    );
    if (!restaurantOrder)
      return res.status(404).json({ message: "shop order not found" });

    restaurantOrder.status = status;
    if (
      restaurantOrder.status == "Out for Delivery" &&
      !restaurantOrder.assignment
    ) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearByDeliveryPartners = await userModel.find({
        role: "Delivery Partner",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 50000000,
          },
        },
      });

      const nearByPartnerIds = nearByDeliveryPartners.map((p) => p._id);

      const busyPartnerIds = await DeliveryAssignmentModel.find({
        deliveryPartner: { $in: nearByPartnerIds },
        status: { $nin: ["broadcasted", "delivered"] },
      }).distinct("deliveryPartner");

      const busyPartnersSet = new Set(busyPartnerIds);

      const availablePartners = nearByDeliveryPartners.filter(
        (p) => !busyPartnersSet.has(String(p._id)),
      );
      const candidates = availablePartners.map((p) => p._id);

      if (candidates.length == 0) {
        await order.save();
        return res
          .status(404)
          .json({ message: "No delivery partners available" });
      }

      const deliveryAssignment = await DeliveryAssignmentModel.create({
        order: orderId,
        restaurant: restaurantOrder.restaurant,
        restaurantOrderId: restaurantOrder._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });
      await deliveryAssignment.populate("order");
      await deliveryAssignment.populate("restaurant");

      restaurantOrder.assignment = deliveryAssignment._id;
      restaurantOrder.assignedDeliveryPartner =
        deliveryAssignment.deliveryPartner;

      deliveryPartnersPayload = availablePartners.map((p) => ({
        id: p._id,
        fullname: p.fullname,
        longitude: p.location.coordinates[0],
        latitude: p.location.coordinates[1],
        mobile: p.mobile,
      }));

      const io = req.app.get("io");
      if (io) {
        availablePartners.forEach((p) => {
          const partnerSocketId = p.socketId;
          if (partnerSocketId) {
            io.to(partnerSocketId).emit("newAssignment", {
              sentTo: p._id,
              assignmentId: deliveryAssignment._id,
              orderId: deliveryAssignment?.order?._id,
              restaurant: deliveryAssignment?.restaurant?.name,
              items:
                deliveryAssignment?.order?.restaurantOrders?.find((ro) =>
                  ro._id.equals(deliveryAssignment.restaurantOrderId),
                )?.orderItems || [],
              subtotal: deliveryAssignment?.order?.restaurantOrders?.find(
                (ro) => ro._id.equals(deliveryAssignment.restaurantOrderId),
              )?.subtotal,
              deliveryAddress: deliveryAssignment?.order?.deliveryAddress,
            });
          }
        });
      }
    }

    await order.save();
    const updatedRestaurantOrder = order.restaurantOrders.find(
      (o) => o.restaurant == restaurantId,
    );

    await order.populate("restaurantOrders.restaurant", "name");
    await order.populate(
      "restaurantOrders.assignedDeliveryPartner",
      "fullname email mobile",
    );
    await order.populate("user");

    const io = req.app.get("io");

    if (io) {
      const userSocketId = order.user.socketId;
      io.to(userSocketId).emit("orderStatus", {
        orderId: order._id,
        restaurantId: updatedRestaurantOrder.restaurant._id,
        status: updatedRestaurantOrder.status,
        userId: order.user._id,
      });
    }

    res.status(200).json({
      message: "order status updated successfully",
      restaurantOrder: updatedRestaurantOrder,
      assignedDeliveryPartner: updatedRestaurantOrder?.assignedDeliveryPartner,
      availablePartners: deliveryPartnersPayload,
      assignment: updatedRestaurantOrder?.assignment,
    });
  } catch (error) {
    res.status(500).json({ message: `update order status error: ${error}` });
  }
}

const getDeliveryPartnerAssignments = async (req, res) => {
  try {
    const deliveryPartner = req.userId;
    const assignments = await DeliveryAssignmentModel.find({
      broadcastedTo: deliveryPartner,
      status: "broadcasted",
    })
      .populate("order")
      .populate("restaurant");

    const formatted = assignments.map((a) => ({
      assignmentId: a._id,
      orderId: a?.order?._id,
      restaurant: a?.restaurant?.name,
      items:
        a?.order?.restaurantOrders?.find((ro) =>
          ro._id.equals(a.restaurantOrderId),
        )?.orderItems || [],
      subtotal: a?.order?.restaurantOrders?.find((ro) =>
        ro._id.equals(a.restaurantOrderId),
      )?.subtotal,
      deliveryAddress: a?.order?.deliveryAddress,
    }));

    res.status(200).json({ assignments: formatted });
  } catch (error) {
    res
      .status(500)
      .json({ message: `get delivery partner assignments error: ${error}` });
  }
};

const acceptDeliveryAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const deliveryPartnerId = req.userId;

    const assignment = await DeliveryAssignmentModel.findById(assignmentId);

    if (!assignmentId)
      return res.status(404).json({ message: "assignment not found" });

    const alreadyAssigned = await DeliveryAssignmentModel.findOne({
      status: { $nin: ["broadcasted", "delivered"] },
      deliveryPartner: deliveryPartnerId,
    });

    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ message: "Another order already assigned" });
    }

    if (assignment.status !== "broadcasted") {
      return res.status(400).json({ message: "assignment expired" });
    }

    assignment.status = "assigned";
    assignment.deliveryPartner = deliveryPartnerId;
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await orderModel.findById(assignment.order);

    if (!order) return res.status(404).json({ message: "order not found" });

    const restaurantOrder = order.restaurantOrders.find((ro) =>
      ro._id.equals(assignment.restaurantOrderId),
    );

    restaurantOrder.assignedDeliveryPartner = deliveryPartnerId;
    await order.save();

    res.status(200).json({ message: "order accepted by delivery partner" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `accept delivery assignment error: ${error}` });
  }
};

const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignmentModel.findOne({
      deliveryPartner: req.userId,
      status: "assigned",
    })
      .populate("restaurant", "name")
      .populate("deliveryPartner", "fullname email mobile location")
      .populate({
        path: "order",
        populate: [{ path: "user", select: "fullname email mobile location" }],
      });

    if (!assignment) return res.status(404).json({ message: "no order found" });

    const restaurantOrder = assignment.order.restaurantOrders.find((ro) =>
      ro._id.equals(assignment.restaurantOrderId),
    );

    if (!restaurantOrder)
      return res.status(404).json({ message: "restaurant order not found" });

    let customerLocation = { lat: null, lon: null };
    let deliveryPartnerLocation = { lat: null, lon: null };

    customerLocation.lat = assignment.order.deliveryAddress.latitude;
    customerLocation.lon = assignment.order.deliveryAddress.longitude;

    deliveryPartnerLocation.lat =
      assignment.deliveryPartner.location.coordinates[1];
    deliveryPartnerLocation.lon =
      assignment.deliveryPartner.location.coordinates[0];

    return res.status(200).json({
      message: "current order",
      _id: assignment.order._id,
      user: assignment.order.user,
      restaurantOrder,
      restaurant: assignment.restaurant,
      deliveryAddress: assignment.order.deliveryAddress,
      customerLocation,
      deliveryPartnerLocation,
    });
  } catch (error) {
    res.status(500).json({ message: `get current order error: ${error}` });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel
      .findById(orderId)
      .populate("user")
      .populate({
        path: "restaurantOrders.restaurant",
        model: "restaurant",
      })
      .populate({
        path: "restaurantOrders.assignedDeliveryPartner",
        model: "User",
      })
      .populate({
        path: "restaurantOrders.orderItems",
        model: "Item",
      })
      .lean();

    if (!order) return res.status(400).json({ message: "order not found" });

    return res.status(200).json({ message: "order found", order });
  } catch (error) {
    res.status(500).json({ message: `get order by id error: ${error}` });
  }
};

const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, restaurantOrderId } = req.body;

    const order = await orderModel.findById(orderId).populate("user");

    const restaurantOrder = order.restaurantOrders.id(restaurantOrderId);

    if (!order || !restaurantOrder) {
      return res.status(400).json({ message: "order not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    restaurantOrder.otp = otp;
    restaurantOrder.otpExpiry = Date.now() + 5 * 60 * 1000;

    await order.save();
    await sendDeliveryOtpMail(order.user, otp);

    return res
      .status(200)
      .json({ message: `otp sent successfully to ${order.user?.fullname}` });
  } catch (error) {
    res.status(500).json({ message: `send delivery otp error: ${error}` });
  }
};

const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, restaurantOrderId, otp } = req.body;

    const order = await orderModel.findById(orderId).populate("user");

    const restaurantOrder = order.restaurantOrders.id(restaurantOrderId);

    if (!order || !restaurantOrder) {
      return res.status(400).json({ message: "order not found" });
    }

    if (
      restaurantOrder.otp !== Number(otp) ||
      restaurantOrder.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "OTP Invalid/Expired" });
    }

    restaurantOrder.status = "Delivered";
    restaurantOrder.deliveredAt = Date.now();
    await order.save();

    await DeliveryAssignmentModel.deleteOne({
      order: order._id,
      restaurantOrderId: restaurantOrder._id,
      deliveryPartner: restaurantOrder.assignedDeliveryPartner,
    });

    const io = req.app.get("io");
    if (io) {
      const userSocketId = order.user.socketId;
      io.to(userSocketId).emit("orderDelivered", {
        userId: order.user._id,
        orderId,
        restaurantId: restaurantOrder.restaurant,
        status: restaurantOrder.status,
      });
    }

    return res.status(200).json({ message: "order delivered successfully" });
  } catch (error) {
    res.status(500).json({ message: `verify delivery otp error: ${error}` });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    const payment = await instance.payments.fetch(paymentId);

    if (!payment || payment.status !== "captured") {
      return res.status(400).json({ message: "payment not verified" });
    }

    const order = await orderModel.findById(orderId);

    if (!order) return res.status(404).json({ message: "order not found" });

    order.payment = true;
    order.razorpayPaymentId = paymentId;
    await order.save();

    await order.populate("restaurantOrders.restaurant", "name");
    await order.populate(
      "restaurantOrders.orderItems.item",
      "name image price",
    );
    await order.populate("restaurantOrders.owner", "fullname socketId");
    await order.populate("user");

    const io = req.app.get("io");

    if (io) {
      order.restaurantOrders.forEach((restaurantOrder) => {
        const ownerSocketId = restaurantOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: order._id,
            paymentMethod: order.paymentMethod,
            deliveryAddress: order.deliveryAddress,
            user: order.user,
            restaurantOrders: restaurantOrder,
            payment: order.payment,
            createdAt: order.createdAt,
          });
        }
      });
    }

    return res
      .status(200)
      .json({ message: "payment verified successfully", order });
  } catch (error) {
    res.status(500).json({ message: `verify payment error: ${error}` });
  }
};

const getTodayDeliveries = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const deliveryPartnerId = req.userId;

    const orders = await orderModel.find({
      "restaurantOrders.status": "Delivered",
      "restaurantOrders.assignedDeliveryPartner": deliveryPartnerId,
      "restaurantOrders.deliveredAt": {
        $gte: startOfDay,
      },
    });

    let todayDeliveries = [];

    orders.forEach((order) => {
      order.restaurantOrders.forEach((restaurantOrder) => {
        if (
          restaurantOrder.assignedDeliveryPartner == deliveryPartnerId &&
          restaurantOrder.status == "Delivered" &&
          restaurantOrder.deliveredAt >= startOfDay
        ) {
          todayDeliveries.push(restaurantOrder);
        }
      });
    });

    let stats = {};

    todayDeliveries.forEach((delivery) => {
      const hour = delivery.deliveredAt.getHours();
      stats[hour] = (stats[hour] || 0) + 1;
    });

    let formattedStats = Object.keys(stats).map((hour) => ({
      hour: parseInt(hour),
      count: stats[hour],
    }));

    formattedStats.sort((a, b) => a.hour - b.hour);

    return res.status(200).json({ formattedStats });
  } catch (error) {
    res.status(500).json({ message: `get today deliveries error: ${error}` });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  getDeliveryPartnerAssignments,
  acceptDeliveryAssignment,
  getCurrentOrder,
  getOrderById,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  verifyPayment,
  getTodayDeliveries,
};
