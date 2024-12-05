const Table = require("../models/tableModel");
const Food = require("../models/foodModel");
const Order = require("../models/orderModel");
const Bill = require("../models/billModel");

const createTable = async (req, res) => {
  try {
    const { number } = req.body;
    const existingTable = await Table.findOne({ number });

    if (existingTable) {
      return res.status(400).json({ message: "Table number already exists." });
    }

    const table = await Table.create({ number });
    return res
      .status(201)
      .json({ message: "Table created successfully", table });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create table", error: error.message });
  }
};

const createFood = async (req, res) => {
  try {
    const { name, category, price, popularity } = req.body;

    if (popularity < 0) {
      return res
        .status(400)
        .json({ message: "Popularity must be a non-negative value." });
    }

    const food = await Food.create({ name, category, price, popularity });
    return res
      .status(201)
      .json({ message: "Food item created successfully", food });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create food item", error: error.message });
  }
};

const updateFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { name, category, price, popularity } = req.body;

    if (popularity < 0) {
      return res
        .status(400)
        .json({ message: "Popularity must be a non-negative value." });
    }

    const food = await Food.findOneAndUpdate(
      {_id: foodId},
      { name, category, price, popularity },
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ message: "Food item not found." });
    }

    return res
      .status(200)
      .json({ message: "Food item updated successfully", food });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update food item", error: error.message });
  }
};

const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findByIdAndDelete(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food item not found." });
    }

    return res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete food item", error: error.message });
  }
};

const manageOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (status === "accepted") {
      const billAmount = order.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      await Bill.create({
        tableNumber: order.tableNumber,
        orderId: order._id,
        totalAmount: billAmount,
      });
    }

    return res
      .status(200)
      .json({ message: `Order ${status}`, order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to manage order", error: error.message });
  }
};

// View a particular bill
const getBillById = async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await Bill.findById(billId).populate("orderId");

    if (!bill) {
      return res.status(404).json({ message: "Bill not found." });
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

// View all generated bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate("orderId");
    return res
      .status(200)
      .json({ message: "All bills retrieved successfully", bills });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve bills", error: error.message });
  }
};

module.exports = {
  createTable,
  createFood,
  updateFood,
  deleteFood,
  manageOrder,
  getBillById,
  getAllBills,
};
