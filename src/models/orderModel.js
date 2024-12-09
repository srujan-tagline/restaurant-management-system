const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true },
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    anonymousToken: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
