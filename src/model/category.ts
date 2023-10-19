import mongoose, { Schema } from "mongoose";
import { ICate } from "../interface/category";

const categorySchema: Schema<ICate> = new Schema(
  {
    name: {
      type: Schema.Types.String,
      maxLength: 255,
    },
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Categories", categorySchema);
