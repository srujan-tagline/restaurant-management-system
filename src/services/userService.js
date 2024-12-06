const User = require("../models/userModel");

const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    return null;
  }
};

const createUser = async (userData) => {
  try {
    return await User.create(userData);
  } catch (error) {
    return null;
  }
};

const updateUser = async (userId, updates) => {
  try {
    return await User.findByIdAndUpdate(userId, updates, { new: true });
  } catch (error) {
    return null;
  }
};

const saveUser = async (user) => {
  try {
    return await user.save();
  } catch (error) {
    return null;
  }
};

module.exports = {
  findUserByEmail,
  createUser,
  updateUser,
  saveUser,
};
