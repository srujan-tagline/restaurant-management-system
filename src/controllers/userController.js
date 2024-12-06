const mongoose = require("mongoose");
const {
  incrementFoodPopularity,
  retrieveFoodByPopularity,
  retrieveFoodByCategory,
  findFoodByIds,
} = require("../services/foodService");
const {
  findTableByNumber,
  updateTableWithOrder,
} = require("../services/tableService");
const { createOrder } = require("../services/orderService");
const { findBillByOrderId } = require("../services/billService");

const getFoodByPopularity = async (req, res) => {
  try {
    const foodItems = await retrieveFoodByPopularity();
    return res
      .status(200)
      .json({ message: "Food list retrieved based on popularity", foodItems });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve food items", error: error.message });
  }
};

const getFoodByCategory = async (req, res) => {
  try {
    const foodItems = await retrieveFoodByCategory();

    return res
      .status(200)
      .json({ message: "Food items grouped by category", foodItems });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve food items", error: error.message });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    const table = await findTableByNumber(tableNumber);
    if (!table) {
      return res.status(404).json({ message: "Table is not found." });
    }

    if (table.currentOrder) {
      return res
        .status(400)
        .json({ message: "Table already has a pending order." });
    }

    const foodItems = await findFoodByIds(items.map((item) => item.foodId));

    if (foodItems.length !== items.length) {
      return res
        .status(400)
        .json({ message: "Order contain invalid food items." });
    }

    const order = await createOrder({
      tableNumber,
      items: items.map((item) => ({
        foodId: item.foodId,
        quantity: item.quantity,
        price: foodItems.find((food) => food._id.equals(item.foodId)).price,
      })),
    });

    // Update the current order in the table schema
    await updateTableWithOrder(table._id, order._id);

    for (const item of items) {
      await incrementFoodPopularity(item.foodId, item.quantity);
    }

    return res
      .status(201)
      .json({ message: "Order placed successfully", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
  }
};

const getBillForOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const bill = await findBillByOrderId(orderId);

    if (!bill) {
      return res
        .status(404)
        .json({ message: "Bill is not found for this order" });
    }

    return res
      .status(200)
      .json({ message: "Bill retrieved successfully", bill });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve bill", error: error.message });
  }
};

module.exports = {
  getFoodByPopularity,
  getFoodByCategory,
  placeOrder,
  getBillForOrder,
};
