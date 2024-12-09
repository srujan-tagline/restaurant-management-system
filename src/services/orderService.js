const Order = require("../models/orderModel");

const createOrder = async (data) => {
  try {
    return await Order.create(data);
  } catch (error) {
    return null;
  }
};

const findOrderByIdAndUpdate = async (orderId, update) => {
  try {
    return await Order.findOneAndUpdate({ _id: orderId }, update, {
      new: true,
    });
  } catch (error) {
    return null;
  }
};

module.exports = { createOrder, findOrderByIdAndUpdate };
