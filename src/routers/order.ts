import express from "express";

import {
  billHistoryById,
  billHistoryByUserId,
  createBill,
  getAllBill,
  updateBill,
} from "../controller/orderController";
const router = express.Router();

router.get("/order", getAllBill);
// router.get("/order/:id", billHistoryById);
router.get("/order/:userId", billHistoryByUserId);
router.post("/order", createBill);
router.patch("/order/:id", updateBill);

export default router;
