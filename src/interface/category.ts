import mongoose from "mongoose";
export interface ICate {
  name: string;
  products: mongoose.Types.ObjectId[];
}
