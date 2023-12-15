import mongoose from "mongoose";

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shipping_address: string;
  payment_method: string;
  total_price: number;
  history_order_status: IOrderStatus[];
  id_transaction: String;
  createdAt: Date;
  updatedAt: Date;
  userName?: string;
  payment_status: IPaymentStatus;
  current_order_status: IOrderStatus
}

export enum OrderStatus {
  PENDING = "Chờ xác nhận",
  CONFIRM = "Đã xác nhận",
  DELIVERY = "Đang giao",
  RECEIVER = "Đã giao",
  CANCEL = "Đã huỷ",
  EXCHANGE = "Đổi hàng",
}

export enum PaymentStatus {
  UNPAID = "Chưa thanh toán",
  PAID = "Đã thanh toán",
}

export interface IOrderStatus {
  status: OrderStatus;
  updatedAt: Date;
}

export interface IPaymentStatus {
  status: PaymentStatus,
  updatedAt: Date
}

export interface IOrderItem {
  product_id: mongoose.Types.ObjectId;
  _id: string;
  name: string;
  price: number;
  property: {
    quantity: number;
    color: string;
    size: string;
    imageUrl: string;
  };
  sub_total: number;
}
