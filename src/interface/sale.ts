import mongoose from "mongoose";

export interface ISale {
  _id?: any;
  discountPercentage: number;
  categoryId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
}
