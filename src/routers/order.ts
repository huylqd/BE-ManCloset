import express from "express";

import {
  billHistoryById,
  billHistoryByUserId,
  createBill,
  exportBill,
  getAllBill,
  updateBill,
} from "../controller/orderController";
const router = express.Router();

router.get("/order", getAllBill);
router.get("/order/orderId/:id", billHistoryById);
router.get("/order/:userId", billHistoryByUserId);
router.post("/order", createBill);
router.patch("/order/:id", updateBill);
router.get("/order/export", exportBill);

export default router;
