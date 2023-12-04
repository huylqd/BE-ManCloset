import joi from 'joi';

export const signUpSchema = joi.object({
    name: joi.string().required().messages({
        'string.required':"Vui lòng nhập tên",
        'string.empty': "Tên không được để trống"
    }),
    email: joi.string().required().email().messages({
        "string.email": "Email không hợp lệ",
        "string.empty": "Email không được để trống",
        "string.required": "Trường email là bắt buộc"
    }),
    password: joi.string().required().min(6).messages({
        "string.empty": "Password không được để trống",
        "any.required": "Trường password là bắt buộc",
        "string.min": "Password phải có ít nhất {#limit} ký tự"
    }),
    confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
        "any.only": "Password không khớp",
        "string.empty": "Confirm password không được để trống",
        "any.required": "Trường confirm password là bắt buộc",
    }),
    address: joi.array(),
    phone: joi.number(),
    wishList:joi.array(),
    lock:joi.boolean(),
    role: joi.string()
})

export const signInSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.base": `"email" phải là kiểu "text"`,
        "string.empty":`"email" không được bỏ trống`,
        "string.email": `"email" phải có định dạng là email`,
        "any.required": `"email" là trường bắt buộc`, 
    }),
    password: joi.string().min(6).required().messages({
        "string.base": `"password" phải là kiểu "text"`,
        "string.empty": `"password" không được bỏ trống`,
        "string.min": `"password" phải chứa ít nhất {#limit} ký tự`,
        "any.required": `"password" là trường bắt buộc`
    })
})
export const userSchema = joi.object({
    name: joi.string(),
    email: joi.string(),
    avater:joi.string(),
    password: joi.string(),
    confirmPassword: joi.string(),
    address: joi.array(),
    phone: joi.number(),
    wishList:joi.array(),
    isBlocked:joi.boolean(),
    role: joi.string()
})