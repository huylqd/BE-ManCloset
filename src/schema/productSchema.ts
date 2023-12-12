import joi from "joi";

export const productSchema = joi.object({
  _id: joi.string(),
  discount: joi.number(),
  productName: joi.string().required(),
  price: joi.number().required().min(0),
  description: joi.string(),
  images:joi.string(),
  properties: joi.array().items(
    joi.object({
      _id: joi.string(),
      imageUrl: joi.string(),
      color: joi.string(),
      variants: joi.array().items(
        joi.object({
          _id: joi.string(),
          quantity: joi.number().min(0),
          size: joi.string(),
        })
      ),
    })
  ),
  categoryId: joi.string().required(),
  couponId: joi.string(),
  views: joi.number(),
  createdAt: joi.date().default(() => new Date()),
  updatedAt: joi.date().default(() => new Date()),
  deletedAt: joi.date().default(null),
  deleted: joi.boolean().default(false),
});
