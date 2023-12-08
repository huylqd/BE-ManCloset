import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  id?: string;
  user_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  message: string;
  rating: Rating;
  createdAt?: string;
  updatedAt?: string;
}
export enum Rating {
  One = 1,
  OneAndHalf = 1.5,
  Two = 2,
  TwoAndHalf = 2.5,
  Three = 3,
  ThreeAndHalf = 3.5,
  Four = 4,
  FourAndHalf = 4.5,
  Five = 5,
}
