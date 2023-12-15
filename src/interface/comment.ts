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
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}
