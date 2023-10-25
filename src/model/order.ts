import mongoose, { Schema } from "mongoose";
import { IOrder } from "../interface/order";

const orderSchema: Schema<IOrder> = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    payment_method: [
      {
        type: String,
        required: true,
      },
    ],
    shipping_address: {
      type: String,
      required: true,
    },
    order_status: [
      {
        type: String,
        required: true,
      },
    ],
    items: [
      {
        product_id: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        items: {
          quantity: { type: Number },
          color: { type: String },
          size: { type: String },
        },
        price: { type: Number },
        sub_total: { type: Number },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Order", orderSchema);
