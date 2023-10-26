import mongoose, { Document } from "mongoose";
interface property {
  imageUrl: string;
  color: string;
  quantity: number;
  size: string;
}
export interface IProduct extends Document {
  productName: string;
  price: number;
  description?: string;
  properties: property[];
  categoryId: mongoose.Types.ObjectId;
  couponId: mongoose.Types.ObjectId;
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
