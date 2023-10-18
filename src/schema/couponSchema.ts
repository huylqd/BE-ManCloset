import joi from "joi";

export const couponSchema = joi.object({
  coupon_code: joi.string().required(),
  discount_percent: joi.number().required(),
  expiration_date: joi.date().required(),
  start_date: joi.date().required(),
});
