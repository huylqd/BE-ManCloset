import mongoose, { Schema } from "mongoose";
import { ISale } from "../interface/sale";

const saleSchema: Schema<ISale> = new Schema({
  discountPercentage: {
    type: Schema.Types.Number,
    maxLength: 255,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  numberOfProductsToDiscount: {
    type: Schema.Types.Number,
    // required: true,
  },
  startDate: {
    type: Schema.Types.Date,
    required: true,
  },
  endDate: {
    type: Schema.Types.Date,
    required: true,
  },
});

export default mongoose.model("Sale", saleSchema);
