import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/user";

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: Schema.Types.String,
    maxLength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  confirmPassword: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    default: "member"
  },
});
export default mongoose.model("User", userSchema);
