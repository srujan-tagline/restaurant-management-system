const Food = require("../models/foodModel");

const foodCreate = async (data) => {
  try {
    return await Food.create(data);
  } catch (error) {
    return null;
  }
};

const getFoods = async () => {
  try {
    return await Food.find();
  } catch (error) {
    return null;
  }
};

const findFoodByIdAndUpdate = async (foodId, update) => {
  try {
    return await Food.findOneAndUpdate({ _id: foodId }, update, { new: true });
  } catch (error) {
    return null;
  }
};

const incrementFoodPopularity = async (foodId, quantity) => {
  try {
    return await Food.findByIdAndUpdate(foodId, {
      $inc: { popularity: quantity },
    });
  } catch (error) {
    return null;
  }
};

const findFoodByIdAndDelete = async (foodId) => {
  try {
    return await Food.findOneAndDelete({ _id: foodId });
  } catch (error) {
    return null;
  }
};

const retrieveFoodByPopularity = async () => {
  try {
    return await Food.find().sort({ popularity: -1 });
  } catch (error) {
    return null;
  }
};

const retrieveFoodByCategory = async () => {
  try {
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
  } catch (error) {
    return null;
  }
};

const findFoodByIds = async (foodIds) => {
  try {
    return await Food.find({ _id: { $in: foodIds } });
  } catch (error) {
    return null;
  }
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
