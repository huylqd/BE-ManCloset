import mongoose, { Schema } from "mongoose";
import { ICoupon } from "../interface/coupon";

const couponSchema: Schema<ICoupon> = new Schema(
  {
    coupon_code: {
      type: Schema.Types.String,
      maxLength: 255,
    },
    discount_percent: {
      type: Schema.Types.Number,
      maxLength: 255,
    },
    expiration_date: {
      type: Schema.Types.Date,
    },
    start_date: {
      type: Schema.Types.Date,
    },
  },
  { timestamps: false, versionKey: false }
);

export default mongoose.model("Coupon", couponSchema);
