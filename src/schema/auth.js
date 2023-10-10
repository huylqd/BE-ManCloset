import joi, { ref } from "joi";

export const signUpSchema = joi.object({
    name: joi.string().required().messages({
        "string.empty":" name Khong duoc de trong",
        "any.required":" name la bat buoc",
    }),
    email: joi.string().email().required().messages({
        "string.empty":" email Khong duoc de trong",
        "any.required":" price la bat buoc",
        "string.email":"nhap email"
    }),
    password: joi.string().min(6).required().messages({
        "string.empty":" password Khong duoc de trong",
        "any.required":" password la bat buoc",
        "string.min":"mat khau chua it nhat {#limit} ki tu"
    }),
    confirmPassword: joi.string().valid(ref('password')).required().messages({
        "string.empty":" confirmPassword Khong duoc de trong",
        "any.required":" confirmPassword la bat buoc",
        "any.only":"mat khau khong khop"
    }),    
})

export const signInSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.empty":" email Khong duoc de trong",
        "any.required":" price la bat buoc",
        "string.email":"nhap email"
    }),
    password: joi.string().min(6).required().messages({
        "string.empty":" password Khong duoc de trong",
        "any.required":" password la bat buoc",
        "string.min":"mat khau chua it nhat {#limit} ki tu"
    }),
})