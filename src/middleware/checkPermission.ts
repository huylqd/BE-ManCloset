import jwt from "jsonwebtoken";
import User from "../model/user";
import dotenv from 'dotenv'

dotenv.config()
const {ACCESSTOKEN_SECRET, REFESHTOKEN_SECRET} = process.env
export const checkPermission = async (req, res, next, requiredRole) => {
    try {
        if (!req.headers.authorization) {
            throw new Error("Bạn phải đăng nhập để thực hiện hành động này");
        }
        // lấy jwt token từ header
        const token = req.headers.authorization.split(" ")[1];
        const data = await verifyToken(token);
        
        if(!data.status){   
            return res.status(401).json({
                message: data.message,
            });
        }
        const id = data.payload 
        const user = await User.findById(id);
     
        if(user.isBlocked){
            return res.status(401).json({
                message: "Tài khoản của bạn đã bị khóa",
            });
        }
        if (!user || (requiredRole && user.role !== requiredRole)) {
            return res.status(401).json({
                message: "Bạn không có quyền để thực hiện hành động này",
            });
        }
        req.user = user;
        req.headers.user_id = user._id
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const verifyToken = async (data: string) => {
    const result = await jwt.verify(data, ACCESSTOKEN_SECRET , async (err, payload) => {
        if (err) {
            if (err.name === "JsonWebTokenError") {
                return ({
                    message: "Token không hợp lệ",
                    status: false
                });
            }
            if (err.name === "TokenExpiredError") {
                return ({
                    message: "Token hết hạn",
                    status: false
                })
            }
        }
        return { payload, status: true }
    });
    return result
}

export const verifyRefreshToken = async (data: string) => {
    const result = await jwt.verify(data, REFESHTOKEN_SECRET , async (err, payload) => {
        if (err) {
            if (err.name === "JsonWebTokenError") {
                return ({
                    message: "Token không hợp lệ",
                    status: false
                });
            }
            if (err.name === "TokenExpiredError") {
                return ({
                    message: "Refresh Token hết hạn",
                    status: false
                })
            }
        }
        return { payload, status: true }
    });
    return result
}

