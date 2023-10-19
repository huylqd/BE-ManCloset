import Coupon from "../model/coupon";
import { couponSchema } from "../schema/couponSchema";

export const getAllCoupon = async (req: any, res: any) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const coupon = await Coupon.find({});
    if (coupon.length === 0) {
      res.status(404).json({
        message: "Coupon not found",
      });
    }
    res.status(200).json({
      message: "Coupon get successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting coupon list",
    });
  }
};
export const getCouponById = async (req: any, res: any) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      res.status(404).json({
        message: "Coupon not found",
      });
    }
    res.status(200).json({
      message: "Coupon get successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting coupon list",
    });
  }
};
export const createCoupon = async (req: any, res: any) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const { error } = couponSchema.validate(req.body);
    if (error) {
      res.status(404).json({
        message: error.details[0].message,
      });
    }
    const coupon = await Coupon.create(req.body);
    if (!coupon) {
      res.status(404).json({
        message: "Coupon not found",
      });
    }
    res.status(201).json({
      message: "Coupon create successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting coupon list",
    });
  }
};
export const updateCoupon = async (req: any, res: any) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const { error } = couponSchema.validate(req.body);
    if (error) {
      res.status(404).json({
        message: error.details[0].message,
      });
    }
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    const couponId = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!coupon) {
      res.status(404).json({
        message: "Coupon not found",
      });
    }
    res.status(200).json({
      message: "Coupon get successfully",
      data: couponId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting coupon list",
    });
  }
};
export const deleteCoupon = async (req: any, res: any) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete({ _id: id });
    if (!coupon) {
      res.status(404).json({
        message: "Coupon not found",
      });
    }
    res.status(201).json({
      message: "Coupon delete successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting coupon list",
    });
  }
};
