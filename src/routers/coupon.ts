import express from "express";
import { getAllCoupon } from "../controller/couponController";

const router = express.Router();

router.get("", getAllCoupon);

export default router;
