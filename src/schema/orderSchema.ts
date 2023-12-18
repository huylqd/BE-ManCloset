import Joi from "joi";

export const orderSchema = Joi.object({
  user_id: Joi.string(),
  total_price: Joi.number(),
  payment_method: Joi.string(),
  shipping_address: Joi.string(),
  payment_status: Joi.object({
    status: Joi.string(),
    updatedAt: Joi.date(),
  }),
  current_order_status: Joi.object({
    status: Joi.string(),
    updatedAt: Joi.date(),
  }),
  history_order_status: Joi.array().items(
    Joi.object({
      status: Joi.string(),
      updatedAt: Joi.date(),
    })
  ),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.string(),
      price: Joi.number(),
      property: Joi.object({
        quantity: Joi.number(),
        color: Joi.string(),
        size: Joi.string(),
      }),
      sub_total: Joi.number(),
    })
  ),
});
