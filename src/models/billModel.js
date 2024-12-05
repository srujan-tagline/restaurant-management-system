const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
