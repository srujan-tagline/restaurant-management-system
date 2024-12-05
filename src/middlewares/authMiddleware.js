const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Please login to continue." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if (decoded.purpose !== "login") {
    //   return response(
    //     false,
    //     res,
    //     statusCode.FORBIDDEN,
    //     responseMessage.INVALID_TOKEN_FOR_ACTION
    //   );
    // }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User is not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
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
