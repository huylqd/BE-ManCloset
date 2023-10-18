import Coupon from "../model/coupon";

export const getAllCoupon = async (req: any, res: any) => {
  try {
    const coupon = await Coupon.find({});
    if (coupon.length === 0) {
      res.status(404).json({
        message: "Coupon not found",
      });
    }
    res.status(201).json({
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
    const coupon = await Coupon.find({});
    if (coupon.length === 0) {
      res.status(404).json({
        message: "Coupon not found",
      });
    }
    res.status(201).json({
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
    const coupon = await Coupon.find({});
    if (coupon.length === 0) {
      res.status(404).json({
        message: "Coupon not found",
      });
    }
    res.status(201).json({
      message: "Coupon get successfully",
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
    const coupon = await Coupon.find({});
    if (coupon.length === 0) {
      res.status(404).json({
        message: "Coupon not found",
      });
    }
    res.status(201).json({
      message: "Coupon get successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting coupon list",
    });
  }
};
export const deleteCoupon = async (req: any, res: any) => {
  try {
    const coupon = await Coupon.find({});
    if (coupon.length === 0) {
      res.status(404).json({
        message: "Coupon not found",
      });
    }
    res.status(201).json({
      message: "Coupon get successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting coupon list",
    });
  }
};
