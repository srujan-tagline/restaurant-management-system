const mongoose = require("mongoose");
const {
  findTableByNumber,
  tableCreate,
  findTableById,
  updateTableCurrentOrder,
} = require("../services/tableService");
const {
  foodCreate,
  getFoods,
  findFoodByIdAndUpdate,
  findFoodByIdAndDelete,
} = require("../services/foodService");
const { findOrderByIdAndUpdate } = require("../services/orderService");
const {
  createBill,
  findAllBills,
  findBillById,
} = require("../services/billService");

const createTable = async (req, res) => {
  try {
    const { number } = req.body;
    const existingTable = await findTableByNumber(number);

    if (existingTable) {
      return res.status(400).json({ message: "Table number already exists." });
    }

    const table = await tableCreate({ number });
    return res
      .status(201)
      .json({ message: "Table created successfully", table });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create table", error: error.message });
  }
};

const getTableById = async (req, res) => {
  const { tableId } = req.params;

  if (!mongoose.isValidObjectId(tableId)) {
    return res.status(400).json({ message: "Invalid table ID." });
  }

  try {
    const table = await findTableById(tableId);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    return res.status(200).json({ message: "Table details fetched", table });
  } catch (error) {
    console.error("Error fetching table:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createFood = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    const food = await foodCreate({ name, category, price });
    return res
      .status(201)
      .json({ message: "Food item created successfully", food });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create food item", error: error.message });
  }
};

const getAllFood = async (req, res) => {
  try {
    const foodItems = await getFoods();

    if (foodItems.length === 0) {
      return res.status(404).json({ message: "No food items found." });
    }

    return res
      .status(200)
      .json({ message: "All food items retrieved successfully", foodItems });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve food items", error: error.message });
  }
};

const updateFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { name, category, price} = req.body;

    if (!mongoose.isValidObjectId(foodId)) {
      return res.status(400).json({ message: "Invalid food ID." });
    }

    const food = await findFoodByIdAndUpdate(foodId, {
      name,
      category,
      price
    });

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

    if (!mongoose.isValidObjectId(foodId)) {
      return res.status(400).json({ message: "Invalid food ID." });
    }

    const food = await findFoodByIdAndDelete(foodId);

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

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await findOrderByIdAndUpdate(orderId, { status });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (status === "accepted") {
      const billAmount = order.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      await createBill({
        tableNumber: order.tableNumber,
        orderId: order._id,
        totalAmount: billAmount,
      });
      await updateTableCurrentOrder(order.tableNumber, {
        $unset: { currentOrder: "" },
      });
    } else if (status === "rejected") {
      await updateTableCurrentOrder(order.tableNumber, {
        $unset: { currentOrder: "" },
      });
    }
    return res.status(200).json({ message: `Order ${status}`, order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to manage order", error: error.message });
  }
};

const getBillById = async (req, res) => {
  try {
    const { billId } = req.params;

    if (!mongoose.isValidObjectId(billId)) {
      return res.status(400).json({ message: "Invalid bill ID." });
    }

    const bill = await findBillById(billId);

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

const getAllBills = async (req, res) => {
  try {
    const bills = await findAllBills();

    if (bills.length === 0) {
      return res.status(404).json({ message: "No bills found." });
    }

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
  getTableById,
  createFood,
  getAllFood,
  updateFood,
  deleteFood,
  manageOrder,
  getBillById,
  getAllBills,
};
