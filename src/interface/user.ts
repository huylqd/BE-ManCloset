import { Request } from "express";
import mongoose from "mongoose";

type Address = {
  id: any,
  city: String,
  district: String,
  wards: String,
  detailAdress: String
  isDefault: Boolean
}
export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: Address[];
  phone: number | undefined;
  role: string;
}

export interface IRequestWithUser extends Request {
  user: IUser;
}
