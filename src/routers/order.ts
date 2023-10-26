import express from "express";

import {
  billHistoryById,
  billHistoryByUserId,
  createBill,
  getAllBill,
  updateBill,
} from "../controller/orderController";
const router = express.Router();

router.get("/cart", getAllBill);
router.get("/cart/:id", billHistoryById);
router.get("/cart/:userId", billHistoryByUserId);
router.post("/cart", createBill);
router.patch("/cart/:id", updateBill);

export default router;
