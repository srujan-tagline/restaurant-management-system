const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

module.exports = { generateToken, hashPassword };
