const Order = require("../models/orderModel");

const createOrder = async (data) => {
  return await Order.create(data);
};

const findOrderByIdAndUpdate = async (orderId, update) => {
  return await Order.findOneAndUpdate({ _id: orderId }, update, { new: true });
};

module.exports = { createOrder, findOrderByIdAndUpdate };
