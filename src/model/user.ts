import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/user";

const userSchema: Schema<IUser> = new mongoose.Schema({
  firstName: {
    type: Schema.Types.String,
    maxLength: 255,
  },
  lastName: {
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
  },
  authType: {
    type: String,
    enum: ["Google", "Facebook", "Defix", "Local"],
    default: "Local",
  },
});
export default mongoose.model("User", userSchema);
