import express from "express";

import {
  billHistoryById,
  billHistoryByUserId,
  createBill,
  exportBill,
  exportBillById,
  getAllBill,
  getBills,
  getUserOrdersHistory,
  updateBill,
} from "../controller/orderController";
import { wrapRequestHandler } from "../utils/handlers";
const router = express.Router();

router.get("/order", getAllBill);
router.get("/order/orderId/:id", billHistoryById);
router.get("/order/export", exportBill);
router.get("/order/export/:bill_id", wrapRequestHandler(exportBillById));
router.get("/order/user/:userId", billHistoryByUserId);
router.post("/order", createBill);
router.patch("/order/:id", updateBill);

router.get("/orders", getBills)
router.get("/users/:id/orders", getUserOrdersHistory);

export default router;
