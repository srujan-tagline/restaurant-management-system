const express = require("express");
const {
  authenticateUser,
  authorizeRole,
} = require("../middlewares/authMiddleware");
const {
  createTable,
  createFood,
  getAllFood,
  updateFood,
  deleteFood,
  manageOrder,
  getBillById,
  getAllBills,
} = require("../controllers/adminController");
const validate = require("../middlewares/validate");
const { createTableSchema } = require("../validators/tableValidation");
const { manageOrderSchema } = require("../validators/orderValidation");
const {
  createFoodSchema,
  updateFoodSchema,
} = require("../validators/foodValidation");

const router = express.Router();

router.post(
  "/table",
  authenticateUser,
  authorizeRole(["admin"]),
  validate(createTableSchema),
  createTable
);
router.post(
  "/food",
  authenticateUser,
  authorizeRole(["admin"]),
  validate(createFoodSchema),
  createFood
);
router.get("/foods", authenticateUser, authorizeRole(["admin"]), getAllFood);
router.put(
  "/food/:foodId",
  authenticateUser,
  authorizeRole(["admin"]),
  validate(updateFoodSchema),
  updateFood
);
router.delete(
  "/food/:foodId",
  authenticateUser,
  authorizeRole(["admin"]),
  deleteFood
);
router.put(
  "/order/:orderId",
  authenticateUser,
  authorizeRole(["admin"]),
  validate(manageOrderSchema),
  manageOrder
);
router.get(
  "/bill/:billId",
  authenticateUser,
  authorizeRole(["admin"]),
  getBillById
);
router.get("/bills", authenticateUser, authorizeRole(["admin"]), getAllBills);

module.exports = router;
