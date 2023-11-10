import mongoose, { Document } from "mongoose";
import paginate from "mongoose-paginate-v2";
import mongooseDelete from "mongoose-delete";
import { IProduct } from "../interface/product";

const plugins = [paginate, mongooseDelete];

const propertySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
  color: {
    type: String,
  },
  variants: [
    {
      size: { type: String },
      quantity: { type: Number },
    },
  ],
});

const productSchema = new mongoose.Schema<IProduct>(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
    },
    properties: [propertySchema],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

plugins.forEach((plugin) => {
  productSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});

export default mongoose.model<IProduct, mongoose.PaginateModel<IProduct>>(
  "Product",
  productSchema
);
