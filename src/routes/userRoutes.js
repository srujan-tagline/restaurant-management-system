const express = require("express");
const {
  getFoodByPopularity,
  getFoodByCategory,
  placeOrder,
  getBillForOrder,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizeRole,
} = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { placeOrderSchema } = require("../validators/orderValidation");

const router = express.Router();

router.get(
  "/food/popular",
  authenticateUser,
  authorizeRole(["user"]),
  getFoodByPopularity
);
router.get(
  "/food/category",
  authenticateUser,
  authorizeRole(["user"]),
  getFoodByCategory
);

router.post(
  "/order",
  authenticateUser,
  authorizeRole(["user"]),
  validate(placeOrderSchema),
  placeOrder
);

router.post(
  "/order-without-login",
  validate(placeOrderSchema),
  placeOrder
);

router.get(
  "/order/:orderId/bill",
  authenticateUser,
  authorizeRole(["user"]),
  getBillForOrder
);

module.exports = router;
