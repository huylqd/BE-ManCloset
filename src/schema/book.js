import joi from 'joi'

export const bookSchema = joi.object({
    name: joi.string().required().messages({
        "string.empty":" name Khong duoc de trong",
        "any.required":" name la bat buoc",
    }),
    price: joi.number().required().messages({
        "any.required":" price la bat buoc",
    }),
    description: joi.string(),
    image: joi.string()
})