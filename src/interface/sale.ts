import mongoose from "mongoose";

export interface ISale {
  _id?: any;
  discountPercentage: number;
  numberOfProductsToDiscount: number;
  categoryId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
}
