import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
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

categorySchema.plugin(mongoosePaginate);
const category = mongoose.model<ICate, mongoose.PaginateModel<ICate>>(
  "Categories",
  categorySchema
);
export default category;
