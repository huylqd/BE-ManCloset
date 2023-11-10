import joi from "joi";

export const commentSchema = joi.object({
  user_id: joi.string(),
  product_id: joi.string(),
  message: joi.string(),
  rating: joi.number(),
});
