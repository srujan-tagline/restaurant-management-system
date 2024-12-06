const Table = require("../models/tableModel");

const findTableByNumber = async (number) => {
  return await Table.findOne({ number });
};

const tableCreate = async (data) => {
  return await Table.create(data);
};

const findTableById = async (tableId) => {
  return await Table.findById(tableId).populate({
    path: "currentOrder",
    populate: {
      path: "items.foodId",
      select: "name category price",
    },
  });
};

const updateTableCurrentOrder = async (tableNumber, update) => {
  return await Table.findOneAndUpdate({ number: tableNumber }, update);
};

module.exports = {
  findTableByNumber,
  tableCreate,
  findTableById,
  updateTableCurrentOrder,
};
