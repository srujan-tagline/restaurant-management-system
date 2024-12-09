const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const { response } = require("../utils/common");
const { statusCode, responseMessage } = require("../utils/constant");
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
const {
  findBillByOrderIdAndUserId,
  findBillByOrderIdAndAnonymousToken,
  findBillsByUserId,
} = require("../services/billService");

const getFoodByPopularity = async (req, res) => {
  try {
    const foodItems = await retrieveFoodByPopularity();
    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.POPULAR_FOOD_LIST,
      foodItems
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

const getFoodByCategory = async (req, res) => {
  try {
    const foodItems = await retrieveFoodByCategory();

    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.CATEGORY_FOOD_LIST,
      foodItems
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

const placeOrder = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;
    const userId = req?.user?._id;
    const anonymousToken = userId ? null : uuidv4();

    const table = await findTableByNumber(tableNumber);
    if (!table) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.TABLE_NOT_FOUND
      );
    }

    if (table.currentOrder) {
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.TABLE_HAS_PENDING_ORDER
      );
    }

    const foodItems = await findFoodByIds(items.map((item) => item.foodId));

    if (foodItems.length !== items.length) {
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.ORDER_CONTAIN_INVALID_FOOD
      );
    }

    const order = await createOrder({
      tableNumber,
      items: items.map((item) => ({
        foodId: item.foodId,
        quantity: item.quantity,
        price: foodItems.find((food) => food._id.equals(item.foodId)).price,
      })),
      userId,
      anonymousToken,
    });

    // Update the current order in the table schema
    await updateTableWithOrder(table._id, order._id);

    for (const item of items) {
      await incrementFoodPopularity(item.foodId, item.quantity);
    }

    return response(
      true,
      res,
      statusCode.CREATED,
      responseMessage.ORDER_PLACED,
      order
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.ORDER_PLACED_FAILED
    );
  }
};

const getBillForOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { anonymousToken } = req.body;
    const userId = req?.user?._id;

    if (!mongoose.isValidObjectId(orderId)) {
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.INVALID_ORDER_ID
      );
    }

    if (userId) {
      var bill = await findBillByOrderIdAndUserId(orderId, userId);
    } else if (anonymousToken) {
      var bill = await findBillByOrderIdAndAnonymousToken(
        orderId,
        anonymousToken
      );
    }

    if (!bill) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.BILL_NOT_FOUND_FOR_ORDER
      );
    }

    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.BILL_RETRIEVED,
      bill
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.BILL_RETRIEVE_FAILED,
      error.message
    );
  }
};

const getAllBills = async (req, res) => {
  try {
    const bills = await findBillsByUserId(req.user._id);

    if (!bills.length) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.BILLS_NOT_FOUND_FOR_USER
      );
    }

    const totalAmount = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    res.status(200).json({
      message: "User's bills retrieved successfully",
      totalAmount,
      bills,
    });
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.BILLS_RETRIEVE_FAILED,
      error.message
    );
  }
};

module.exports = {
  getFoodByPopularity,
  getFoodByCategory,
  placeOrder,
  getBillForOrder,
  getAllBills,
};
