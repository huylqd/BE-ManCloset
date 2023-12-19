import mongoose, { Document } from "mongoose";
import paginate from "mongoose-paginate-v2";
import mongooseDelete from "mongoose-delete";
import { IProduct } from "../interface/product";

const plugins = [paginate, mongooseDelete];
const variantSchema = new mongoose.Schema({
    size: { type: String },
    quantity: { type: Number },
},{_id:false})
const propertySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
  color: {
    type: String,
  },
  variants: [variantSchema],
},{_id:false});

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
    views: {
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
    overrideMethods: "all",
  });
});

export default mongoose.model<IProduct, mongoose.PaginateModel<IProduct>>(
  "Product",
  productSchema
);
