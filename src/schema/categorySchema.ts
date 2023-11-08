import joi from "joi";

export const categorySchema = joi.object({
  _id: joi.string(),
  name: joi.string().required(),
});
