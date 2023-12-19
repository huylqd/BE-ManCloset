import mongoose, { Schema } from "mongoose";
import { IOrder, OrderStatus, PaymentStatus } from "../interface/order";
import mongoosePaginate from "mongoose-paginate-v2";
const itemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
    },
    price: Number,
    product_name: {
      type: String
    },
    property: {
      quantity: Number,
      color: String,
      size: String,
      imageUrl: String,
    },
    sub_total: Number,
  },
  { _id: false }
);

const ORDER_STATUS = {
  PENDING: "Chờ xác nhận",
  CONFIRM: "Đã xác nhận",
  DELIVERY: "Đang giao",
  DELIVERED: "Đã giao",
  RECEIVER: "Đã nhận",
  CANCEL: "Đã huỷ",
  EXCHANGE: "Đổi hàng",
};

const PAYMENT_STATUS = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
};

const orderStatusSchema = new mongoose.Schema({
  status: {
    enum: [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.CONFIRM,
      ORDER_STATUS.DELIVERY,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.RECEIVER,
      ORDER_STATUS.CANCEL,
      ORDER_STATUS.EXCHANGE,
    ],
    type: String,
    default: ORDER_STATUS.PENDING,
    required: true,
  },
  updatedAt: {
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
    payment_status: {
      status: {
        type: String,
        enum: [PAYMENT_STATUS.UNPAID, PAYMENT_STATUS.PAID],
        required: true,
        default: PAYMENT_STATUS.UNPAID,
      },
      updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
    current_order_status: {
      status: {
        type: String,
        enum: [
          ORDER_STATUS.PENDING,
          ORDER_STATUS.CONFIRM,
          ORDER_STATUS.DELIVERY,
          ORDER_STATUS.DELIVERED,
          ORDER_STATUS.RECEIVER,
          ORDER_STATUS.CANCEL,
          ORDER_STATUS.EXCHANGE,
        ],
        default: ORDER_STATUS.PENDING,
        required: true,
      },
      updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
    history_order_status: [orderStatusSchema],
    items: [itemSchema],
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    id_transaction: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

orderSchema.pre("save", function (next) {
  if (this.payment_method === "vnpay" && this.history_order_status.length === 0) {
    this.payment_status = {
      status: PaymentStatus.UNPAID,
      updatedAt: new Date(),
    };

    this.current_order_status = {
      status: OrderStatus.PENDING,
      updatedAt: new Date(),
    };

    this.history_order_status.push({
      status: OrderStatus.PENDING,
      updatedAt: new Date(),
    });
  } else if (this.payment_method === "shipcode" && this.history_order_status.length === 0) {
    this.payment_status = {
      status: PaymentStatus.UNPAID,
      updatedAt: new Date(),
    };

    this.current_order_status = {
      status: OrderStatus.PENDING,
      updatedAt: new Date(),
    };

    this.history_order_status.push({
      status: OrderStatus.PENDING,
      updatedAt: new Date(),
    });
  }

  next();
});
orderSchema.plugin(mongoosePaginate);

const order = mongoose.model<IOrder, mongoose.PaginateModel<IOrder>>(
  "Order",
  orderSchema
);
export default order;
