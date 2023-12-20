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
type WishList  = {
  _id?:string,
  name:string,
  imageUrl :string,
  price:number
}
export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  avatar:string;
  password: string;
  confirmPassword: string;
  address: Address[];
  wishList:WishList[];
  isBlocked:Boolean;
  phone: string;
  googleId:string;
  authType:string,
  role: string;
  passwordResetToken:string,
  passwordResetExpires:number,
  passwordChangeAt: number
}

export interface IRequestWithUser extends Request {
  user: IUser;
}
