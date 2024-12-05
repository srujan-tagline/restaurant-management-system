const express = require("express");
const {
  authenticateUser,
  authorizeRole,
} = require("../middlewares/authMiddleware");
const {
  createTable,
  createFood,
  updateFood,
  deleteFood,
  manageOrder,
  getBillById,
  getAllBills,
} = require("../controllers/adminController");

const router = express.Router();

router.post("/table", authenticateUser, authorizeRole(["admin"]), createTable);
router.post("/food", authenticateUser, authorizeRole(["admin"]), createFood);
router.put(
  "/food/:foodId",
  authenticateUser,
  authorizeRole(["admin"]),
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
