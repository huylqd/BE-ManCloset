import joi from "joi";

export const productSchema = joi.object({
  productName: joi.string().required(),
  price: joi.number().required().min(0),
  description: joi.string(),
  properties: joi.array().items(
    joi.object({
      imageUrl: joi.string().required(),
      color: joi.string().required(),
      quantity: joi.number().required().min(0),
      size: joi.string().required(),
    })
  ),
  categoryId: joi.string().required(),
  couponId: joi.string().required(),
  createdAt: joi.date().default(() => new Date()),
  updatedAt: joi.date().default(() => new Date()),
  deletedAt: joi.date().default(null),
  deleted: joi.boolean().default(false),
});
