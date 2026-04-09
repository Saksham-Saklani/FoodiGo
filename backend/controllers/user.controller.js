const userModel = require("../models/user.model");
const itemModel = require("../models/item.model");

async function getCurrentUser(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user" });
  }
}

async function updateUserLocation(req, res) {
  try {
    const { lat, lon } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          coordinates: [lon, lat],
        },
      },
      { new: true },
    );

    res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    res.status(500).json({ message: `Update location error: ${error}` });
  }
}

async function itemRating(req, res) {
  try {
    const { itemId, rating } = req.body;

    if (!itemId || !rating) {
      return res
        .status(400)
        .json({ message: "Item ID and rating are required" });
    }

    if (rating > 5 || rating < 1) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const item = await itemModel.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    newCount = item.rating.count + 1;
    newAverage = (item.rating.average * item.rating.count + rating) / newCount;

    item.rating.count = newCount;
    item.rating.average = newAverage;
    await item.save();

    return res.status(200).json({ message: "Item rated successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Error rating item: ${error}` });
  }
}

module.exports = {
  getCurrentUser,
  updateUserLocation,
  itemRating,
};
