import { Request } from "express";

type Address = {
  city: String,
  district: String,
  wards: String,
  detailAdress: String
  isDefault: Boolean
}
export interface IUser {
  _id: string;
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
