const Food = require("../models/foodModel");

const foodCreate = async (data) => {
  return await Food.create(data);
};

const getFoods = async () => {
  return await Food.find();
};

const findFoodByIdAndUpdate = async (foodId, update) => {
  return await Food.findOneAndUpdate({ _id: foodId }, update, { new: true });
};

const incrementFoodPopularity = async (foodId, quantity) => {
  return await Food.findByIdAndUpdate(foodId, {
    $inc: { popularity: quantity },
  });
};

const findFoodByIdAndDelete = async (foodId) => {
  return await Food.findOneAndDelete({ _id: foodId });
};

const retrieveFoodByPopularity = async () => {
  return await Food.find().sort({ popularity: -1 });
};

const retrieveFoodByCategory = async () => {
  return await Food.aggregate([
    {
      $group: {
        _id: "$category",
        foods: {
          $push: {
            name: "$name",
            price: "$price",
            popularity: "$popularity",
          },
        },
      },
    },
  ]);
};

const findFoodByIds = async (foodIds) => {
  return await Food.find({ _id: { $in: foodIds } });
};

module.exports = {
  foodCreate,
  getFoods,
  findFoodByIdAndUpdate,
  incrementFoodPopularity,
  findFoodByIdAndDelete,
  retrieveFoodByPopularity,
  retrieveFoodByCategory,
  findFoodByIds,
};
