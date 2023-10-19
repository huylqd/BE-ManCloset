import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupon,
  getCouponById,
  updateCoupon,
} from "../controller/couponController";

const router = express.Router();

router.get("/coupon", getAllCoupon);
router.post("/coupon", createCoupon);
router.get("/coupon/:id", getCouponById);
router.delete("/coupon/:id", deleteCoupon);
router.put("/coupon/:id", updateCoupon);

export default router;
