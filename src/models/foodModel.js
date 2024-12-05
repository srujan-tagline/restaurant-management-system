const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    popularity: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
