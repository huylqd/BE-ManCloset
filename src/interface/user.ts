import { Request } from "express";

export interface IUser {
  _id: string;
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
