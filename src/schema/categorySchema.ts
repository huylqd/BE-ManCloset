import joi from "joi";

export const categorySchema = joi.object({
  _id: joi.string(),
  name: joi.string().required(),
  products: joi.array(),
  deletedAt: joi.date().default(null),
  deleted: joi.boolean().default(false),
  createdAt:joi.date(),
  updatedAt:joi.date(),
});
