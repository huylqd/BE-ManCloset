import User from "../model/user";
import jwt from "jsonwebtoken";

export const checkPermission = async(req, res, next) => {
    try {
        if(!req.headers.authorization) {
            return res.status(400).json({
                message: "Ban chua dang nhap"
            })
        }
        const token = req.headers.authorization.split(" ")[1]
        const {id} = jwt.verify(token, "123456")
        const user = await User.findById(id)
        if(user.role !== 'admin') {
            return res.status(400).json({
                message: "Ban khong co quyen"
            })
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error
        })
    }
}