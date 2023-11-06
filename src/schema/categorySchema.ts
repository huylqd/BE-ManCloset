import joi from "joi";

export const categorySchema = joi.object({
  id: joi.string(),
  name: joi.string().required(),
});
