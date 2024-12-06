const Bill = require("../models/billModel");

const createBill = async (data) => {
  return await Bill.create(data);
};

const findBillById = async (billId) => {
  return await Bill.findById(billId).populate("orderId");
};

const findAllBills = async () => {
  return await Bill.find().populate("orderId");
};

const findBillByOrderId = async (orderId) => {
  return await Bill.findOne({ orderId }).populate("orderId");
};

module.exports = {
  createBill,
  findBillById,
  findAllBills,
  findBillByOrderId
};
