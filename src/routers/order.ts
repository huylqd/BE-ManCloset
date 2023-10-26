import express from "express";

import {
  createBill,
  getAllBill,
  updateBill,
} from "../controller/orderController";
const router = express.Router();

router.get("/cart", getAllBill);
router.post("/cart", createBill);
router.patch("/cart/:id", updateBill);

export default router;
