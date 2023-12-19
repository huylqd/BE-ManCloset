import mongoose, { Document } from "mongoose";

type property = {
  imageUrl: string;
  color: string;
  variants: {
    quantity: number;
    size: string;
  }[];
};
export interface IProduct extends Document {
  productName: string;
  price: number;
  description?: string;
  properties: property[];
  categoryId: mongoose.Types.ObjectId;
  discount: number;
  views: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  deleted?: boolean;
  forceDelete: () => Promise<void>;
}
export interface IProductResponse {
  data: IProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
export interface ProductItem {
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  subTotal: number;
  description: string;
}
