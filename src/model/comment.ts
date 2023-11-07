import mongoose, { Schema } from "mongoose";
import { IComment } from "../interface/comment";

const commentSchema: Schema<IComment> = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
      type: Number,
      required: true,
      default: 5,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Comment", commentSchema);
