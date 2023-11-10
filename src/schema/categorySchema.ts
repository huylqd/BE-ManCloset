import joi from "joi";

export const categorySchema = joi.object({
  _id: joi.string(),
  name: joi.string().required(),
  products: joi.array(),
  createdAt:joi.date(),
  updatedAt:joi.date(),
});
