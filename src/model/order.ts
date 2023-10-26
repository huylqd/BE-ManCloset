import mongoose, { Schema } from "mongoose";
import { IOrder, OrderStatus } from "../interface/order";

const itemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
    },
    price: Number,
    property: {
      quantity: Number,
      color: String,
      size: String,
    },
    sub_total: Number,
  },
  { _id: false }
);

const statusSchema = new mongoose.Schema({
  status: {
    enum: [
      "Đang xử lý",
      "Chưa thanh toán" || "Đã thanh toán",
      "Đang giao hàng",
      "Đã nhận",
      "Đã hủy",
    ],
    type: String,
    default: "Đang xử lý",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const orderSchema: Schema<IOrder> = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    payment_method: {
      enum: ["shipcode", "vnpay"],
      type: String,
      default: "shipcode",
      required: true,
    },

    shipping_address: {
      type: String,
      required: true,
    },
    history_order_status: [statusSchema],
    items: [itemSchema],
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

orderSchema.pre("save", function (next) {
  if (
    this.history_order_status.every((entry) => entry.status !== "Đang xử lý")
  ) {
    this.history_order_status.push({
      status: OrderStatus.Processing,
      createdAt: new Date(),
    });
  }
  next();
});

export default mongoose.model("Order", orderSchema);
