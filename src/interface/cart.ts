import mongoose from "mongoose";

// ICartItem cần được update
export interface ICartItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
  updatedAt: Date;
}

export interface ICart {
  user_id: mongoose.Types.ObjectId;
  products: ICartItem[];
}
