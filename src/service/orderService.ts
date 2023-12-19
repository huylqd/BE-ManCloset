import order from "../model/order";
import product from "../model/product";
import { sendMailPaid } from "../utils/sendMail";
import { DeleteProductInCart } from "./cartService";
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
    const items = result.items;
    const user_id = result.user_id;
    let items_id = [];
    for (const item of items) {
      const result = await product.findOne({ _id: item.product_id });

      if (!result) {
        return {message: "Product not found"}
      }

      const selectedColor: any = result.properties.find(
        (prop) => prop.color === item.property.color
      );
      const selectedVariant = selectedColor.variants.find(
        (variant) => variant.size === item.property.size
      );

      if (
        !selectedVariant ||
        selectedVariant.quantity < item.property.quantity
      ) {
        return {
          message: "Không tồn tại màu hoặc hết hàng"
        }
      } else {
        selectedVariant.quantity -= item.property.quantity;
        items_id.push(result._id)
        await result.save();
      }
    }
    await DeleteProductInCart(user_id,items_id);
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
export const checkUserInOrder = async (userId) => {
  try {
    const result = await order.find({user_id:userId});
    if(!result || result.length === 0 ){
      return {
        status: -1,
        message:"User không mua hàng"
      }
    }
    return {
      status:0,
      message:"User đã tồn tại"
    }
  } catch (error) {
    return {
      status: -1,
      message:"Lỗi kiểm tra tài liệu"
    }
  }

}