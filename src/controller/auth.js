import User from "../model/user";
import { signInSchema, signUpSchema } from "../schema/auth";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const {error} = signUpSchema.validate(req.body, {abortEarly: false})
        if(error) {
            return res.status(400).json({
                message: error.details.map(err => err.message)
            })
        }
        const userExits = await User.findOne({email: req.body.email})
        if(userExits) {
            return res.status(400).json({
                message: "User da ton tai"
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        return res.status(201).json({
            message: "Dang ki sach thanh cong",
            data: user
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error
        })
    }
}

export const signin = async (req, res) => {
    try {
        const {error} = signInSchema.validate(req.body, {abortEarly: false})
        if(error) {
            return res.status(400).json({
                message: error.details.map(err => err.message)
            })
        }
        const user = await User.findOne({email: req.body.email})
        if(!user) {
            return res.status(400).json({
                message: "User khong ton tai"
            })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(isMatch) {
            const token = jwt.sign({id: user._id}, '123456', {expiresIn: "1d"})
            return res.status(200).json({
                accessToken: token,
                message: "Dang nahp thanh cong"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}