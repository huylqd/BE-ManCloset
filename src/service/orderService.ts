import order from "../model/order";
import { sendMailPaid } from "../utils/sendMail";
import { SendMailOrderPaid } from "./sendMailService";

// Kiểm tra xem có tài liệu nào có order_id cụ thể không
export const checkOrderSuccessVnPay = async (transactionId) => {
  try {
    const orderStatus: any = {
      status: "Chờ xác nhận",
      updatedAt: new Date(),
    };
    const paymentStatus: any = {
      status: "Đã thanh toán",
      updatedAt: new Date()
    }
    const result = await order.findOneAndUpdate(
      { id_transaction: transactionId },
      {
        $set: { "history_order_status.0": orderStatus, "payment_status": paymentStatus },
      },
      { new: true }
    );
    console.log("vnpay",);
    SendMailOrderPaid(result)
    if (result) {
      return { message: "Tài liệu tồn tại" };
    } else {
      return { message: "Tài liệu không tồn tại" };
    }
  } catch (error) {
    return { message: "Lỗi kiểm tra tài liệu" };
  }
};
export const checkOrderFailedVnPay = async (transactionId) => {
  try {
    const result = await order.deleteOne({ id_transaction: transactionId });
    if (result) {
      return { message: "Xóa thành công" };
    } else {
      return { message: "Tài liệu không tồn tại" };
    }
  } catch (error) {
    return { message: "Lỗi" };
  }
};
