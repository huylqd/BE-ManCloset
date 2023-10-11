import { Request } from "express";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  authType: "Google" | "Facebook" | "Defix" | "Local";
}

export interface IRequestWithUser extends Request {
  user: IUser;
}
