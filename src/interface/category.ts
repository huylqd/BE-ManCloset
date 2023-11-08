import mongoose from "mongoose";
export interface ICate {
  _id?: string;
  name: string;
  products: mongoose.Types.ObjectId[];
}
