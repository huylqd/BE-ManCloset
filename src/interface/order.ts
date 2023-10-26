import mongoose from "mongoose";

export interface IOrder {
  user_id: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shipping_address: string;
  payment_method: string;
  total_price: number;
  history_order_status: IHistoryStatus[];
}
export enum OrderStatus {
  Processing = "Đang xử lý",
  NotPaid = "Chưa thanh toán",
  Paid = "Đã thanh toán",
  Delivering = "Đang giao hàng",
  Received = "Đã nhận",
  Cancelled = "Đã Hủy",
}

export interface IHistoryStatus {
  status: OrderStatus;
  createdAt: Date;
}

export interface IOrderItem {
  product_id: mongoose.Types.ObjectId;
  property: {
    quantity: number;
    color: string;
    size: string;
  };
  price: number;
  sub_total: number;
}
