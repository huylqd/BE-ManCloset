import jwt from "jsonwebtoken";
import User from "../model/user";
export const checkPermission = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error("Bạn phải đăng nhập để thực hiện hành động này");
        }
        // lấy jwt token từ header
        const token = req.headers.authorization.split(" ")[1];
        const data = await verifyToken(token);
      
        if (!data.status) {
            return res.json({
                message: data.message
            });
        }
        const user = await User.findById(data._id);

        if (user.role != "admin") {
            return res.status(401).json({
                message: "Bạn không có quyền để thực hiện hành động này",
            });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const verifyToken = async (data: string) => {
    const result = await jwt.verify(data, "123456", async (err, payload) => {
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