import mongoose from "mongoose";
export interface ICate {
  _id?: string;
  name: string;
  deleted:boolean,
  deletedAt?:Date,
  products: mongoose.Types.ObjectId[];
}
