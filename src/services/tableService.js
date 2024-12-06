const Table = require("../models/tableModel");

const findTableByNumber = async (tableNumber) => {
  return await Table.findOne({ number: tableNumber });
};

const tableCreate = async (data) => {
  return await Table.create(data);
};

const findTableById = async (tableId) => {
  return await Table.findById(tableId).populate({
    path: "currentOrder",
    populate: {
      path: "items.foodId", // Populate food details inside the order
      select: "name category price",
    },
  });
};

const updateTableCurrentOrder = async (tableNumber, update) => {
  return await Table.findOneAndUpdate({ number: tableNumber }, update);
};

const updateTableWithOrder = async (tableId, orderId) => {
  return await Table.findByIdAndUpdate(tableId, { currentOrder: orderId });
};

module.exports = {
  findTableByNumber,
  tableCreate,
  findTableById,
  updateTableCurrentOrder,
  updateTableWithOrder
};
