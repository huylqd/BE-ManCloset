import mongoose from "mongoose";

export interface IOrder {
  user_id: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shipping_address: string;
  payment_method: string[];
  total_price: number;
  order_status: string[];
}

export interface IOrderItem {
  product_id: mongoose.Types.ObjectId;
  items: {
    quantity: number;
    color: string;
    size: string;
  };
  price: number;
  sub_total: number;
}
