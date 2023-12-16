import User from "../model/user"
import { sendMailOrder, sendMailPaid } from "../utils/sendMail";

export const SendMailOrderPaid = async (order) => {
    try {

        const user = await User.findOne({ _id: order.user_id });
        const { email, name } = user;
        sendMailPaid(name, email, order)
    } catch (error) {
        return {
            status: -1
        }
    }
}
export const SendMailOrderSuccess = async (order) => {
    try {

        const user = await User.findOne({ _id: order.user_id });
        const { email, name } = user;
        sendMailOrder(name, email, order)
    } catch (error) {
        return {
            status: -1
        }
    }
}