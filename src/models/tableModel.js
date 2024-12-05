const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
