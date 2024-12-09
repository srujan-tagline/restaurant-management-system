const Bill = require("../models/billModel");

const createBill = async (data) => {
  try {
    return await Bill.create(data);
  } catch (error) {
    return null;
  }
};

const findBillById = async (billId) => {
  try {
    return await Bill.findById(billId).populate("orderId");
  } catch (error) {
    return null;
  }
};

const findAllBills = async () => {
  try {
    return await Bill.find().populate("orderId");
  } catch (error) {
    return null;
  }
};

const findBillByOrderIdAndUserId = async (orderId, userId) => {
  try {
    return await Bill.findOne({ orderId, userId }).populate("orderId");
  } catch (error) {
    return null;
  }
};

const findBillByOrderIdAndAnonymousToken = async (orderId, anonymousToken) => {
  try {
    return await Bill.findOne({ orderId, anonymousToken }).populate("orderId");
  } catch (error) {
    return null;
  }
};

const findBillsByUserId = async (userId) => {
  try {
    return await Bill.find({ userId }).populate("orderId");
  } catch (error) {
    return null;
  }
};

module.exports = {
  createBill,
  findBillById,
  findAllBills,
  findBillByOrderIdAndUserId,
  findBillByOrderIdAndAnonymousToken,
  findBillsByUserId,
};
