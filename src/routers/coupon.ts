import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupon,
  getCouponById,
  updateCoupon,
} from "../controller/couponController";

const router = express.Router();

router.get("", getAllCoupon);
router.post("", createCoupon);
router.get("/:id", getCouponById);
router.delete("/:id", deleteCoupon);
router.put("/:id", updateCoupon);

export default router;
