import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    products: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
        color: {
          type: String,
        },
        size: {
          type: String,
        },
        imageUrl: {
          type: String,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  
);

export default mongoose.model("Cart", cartSchema);
