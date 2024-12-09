const Table = require("../models/tableModel");

const findTableByNumber = async (tableNumber) => {
  try {
    return await Table.findOne({ number: tableNumber });
  } catch (error) {
    return null;
  }
};

const tableCreate = async (data) => {
  try {
    return await Table.create(data);
  } catch (error) {
    return null;
  }
};

const findTableById = async (tableId) => {
  try {
    return await Table.findById(tableId).populate({
      path: "currentOrder",
      populate: {
        path: "items.foodId", // Populate food details inside the order
        select: "name category price",
      },
    });
  } catch (error) {
    return null;
  }
};

const updateTableCurrentOrder = async (tableNumber, update) => {
  try {
    return await Table.findOneAndUpdate({ number: tableNumber }, update);
  } catch (error) {
    return null;
  }
};

const updateTableWithOrder = async (tableId, orderId) => {
  try {
    return await Table.findByIdAndUpdate(tableId, { currentOrder: orderId });
  } catch (error) {
    return null;
  }
};

module.exports = {
  findTableByNumber,
  tableCreate,
  findTableById,
  updateTableCurrentOrder,
  updateTableWithOrder,
};
