import User from "../model/user";
import { signUpSchema, signInSchema } from "../schema/userSchema";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { verifyToken } from "../middleware/checkPermission";

export const signUp = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        const { error } = signUpSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

        const userExits = await User.findOne({ email })
        if (userExits) {
            return res.status(400).json({
                message: "user already exits"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.json({
            message: "User created successfully",
            user: user
        })

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const signIn = async (req, res) => {
    try {
        const {email, password} = req.body

        const {error} = signInSchema.validate({email, password}, {abortEarly: false})
        if(error) {
            const errors = error.details.map((err) => err.message)
            return res.status(400).json({
                message: errors
            })
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Tài khoản không tồn tại"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu không khớp"
            })
        }
        const token = jwt.sign({_id: user._id}, "123456", {expiresIn: "30s"})
        const refeshToken = jwt.sign({_id: user._id}, "123456", {expiresIn: "45s"} )
        user.password = undefined;
        res.status(200).json({
            message: "Đăng nhập thành công",
            data: user,
            accessToken: token,
            refreshToken: refeshToken,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.errors[0] });
        }
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

export const refeshToken = async (req, res) => {
    const result = await verifyToken(req.body.refreshToken)
    if (!result.status) {
        return res.status(401).json({
            message: result.message
        });
    }
    const token = jwt.sign({_id: result._id}, '123456', {expiresIn: "30s"})
    res.status(200).json({
        message: "Đăng nhập thành công",
        data: token,
    });
}

export const getAllUser = async (req, res) => {
    try {
        const user = await User.find({})
        if(user.length === 0 ) {
            res.status(200).json({
                message:"No have result"
            })
        }
        res.status(200).json({
            message: "Get All User Successfully",
            data: user
        }) 
    } catch (error) {
        return res.status(500).json({
            message: "Error get user "
        })
    }
}

export const getOneUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if(!user) {
            res.status(404).json({
                message: "user not found"
            }) 
        }
        res.status(200).json({
            message: "Get user success",
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error get user",
          });
    }
}