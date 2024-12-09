const mongoose = require("mongoose");
const { response } = require("../utils/common");
const { statusCode, responseMessage } = require("../utils/constant");
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
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.TABLE_ALREADY_EXISTS
      );
    }

    const table = await tableCreate({ number });
    return response(
      true,
      res,
      statusCode.CREATED,
      responseMessage.TABLE_CREATED
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.TABLE_CREATION_FAILED,
      error.message
    );
  }
};

const getTableById = async (req, res) => {
  const { tableId } = req.params;

  if (!mongoose.isValidObjectId(tableId)) {
    return response(
      false,
      res,
      statusCode.BAD_REQUEST,
      responseMessage.INVALID_TABLE_ID
    );
  }

  try {
    const table = await findTableById(tableId);

    if (!table) {
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.TABLE_NOT_FOUND
      );
    }

    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.TABLE_DETAILS_FETCHED
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.FETCHING_TABLE_DETAILS_FAILED
    );
  }
};

const createFood = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    const food = await foodCreate({ name, category, price });
    return response(
      true,
      res,
      statusCode.CREATED,
      responseMessage.FOOD_CREATED
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.FOOD_CREATION_FAILED,
      error.message
    );
  }
};

const getAllFood = async (req, res) => {
  try {
    const foodItems = await getFoods();

    if (foodItems.length === 0) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.FOOD_NOT_FOUND
      );
    }

    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.FOOD_RETRIEVED
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.FOOD_RETRIEVE_FAILED,
      error.message
    );
  }
};

const updateFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { name, category, price } = req.body;

    if (!mongoose.isValidObjectId(foodId)) {
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.INVALID_FOOD_ID
      );
    }

    const food = await findFoodByIdAndUpdate(foodId, {
      name,
      category,
      price,
    });

    if (!food) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.FOOD_NOT_FOUND
      );
    }

    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.FOOD_UPDATED
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.FOOD_UPDATE_FAILED,
      error.message
    );
  }
};

const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    if (!mongoose.isValidObjectId(foodId)) {
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.INVALID_FOOD_ID
      );
    }

    const food = await findFoodByIdAndDelete(foodId);

    if (!food) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.FOOD_NOT_FOUND
      );
    }

    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.FOOD_DELETED
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.FOOD_DELETE_FAILED
    );
  }
};

const manageOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(orderId)) {
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.INVALID_ORDER_ID
      );
    }

    const order = await findOrderByIdAndUpdate(orderId, { status });

    if (!order) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.ORDER_NOT_FOUND
      );
    }

    if (status === "accepted") {
      const billAmount = order.items
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);
      await createBill({
        tableNumber: order.tableNumber,
        orderId: order._id,
        totalAmount: billAmount,
        userId: order.userId,
        anonymousToken: order.anonymousToken,
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
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.MANAGE_ORDER_FAILED,
      error.message
    );
  }
};

const getBillById = async (req, res) => {
  try {
    const { billId } = req.params;

    if (!mongoose.isValidObjectId(billId)) {
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.INVALID_BILL_ID
      );
    }

    const bill = await findBillById(billId);

    if (!bill) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.BILL_NOT_FOUND
      );
    }

    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.BILL_RETRIEVED
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.BILL_RETRIEVE_FAILED
    );
  }
};

const getAllBills = async (req, res) => {
  try {
    const bills = await findAllBills();

    if (bills.length === 0) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.BILLS_NOT_FOUND
      );
    }

    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.BILLS_RETRIEVED
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.BILLS_RETRIEVE_FAILED
    );
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
