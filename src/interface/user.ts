import { Request } from "express";
import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string | undefined;
  phone: number | undefined;
  role: string;
}

export interface IRequestWithUser extends Request {
  user: IUser;
}
