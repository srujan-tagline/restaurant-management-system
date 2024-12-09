const { response } = require("../utils/common");
const { statusCode, responseMessage } = require("../utils/constant");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return response(
      false,
      res,
      statusCode.UNAUTHORIZED,
      responseMessage.UNAUTHENTICATED
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.USER_NOT_FOUND
      );
    }

    req.user = user;
    next();
  } catch (err) {
    // return res.status(401).json({ message: "Invalid or expired token" });
    return response(
      false,
      res,
      statusCode.UNAUTHORIZED,
      responseMessage.INVALID_TOKEN
    );
  }
};

const authorizeRole = (roles) => {
  return async (req, res, next) => {
    if (roles.indexOf(req.user.role) > -1) {
      next();
    } else {
      return res
        .status(403)
        .json({ error: `User's role ${req.user.role} is not authorized.` });
    }
  };
};

module.exports = { authenticateUser, authorizeRole };
