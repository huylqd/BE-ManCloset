import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/user";
import mongoosePaginate from "mongoose-paginate-v2";
const addressSchema = new mongoose.Schema(
  {
    city: String,
    district: String,
    wards: String,
    detailAdress: String,
    isDefault: {
      type:Boolean,
      default: false
    }
  }
)

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
  address: {
    type: [addressSchema],
    required: true,
    default: []
  },
  
  role: {
    type: String,
    default: "member"
  },
});
userSchema.plugin(mongoosePaginate)
const User = mongoose.model<IUser, mongoose.PaginateModel<IUser>>(
  "Users",
  userSchema
);
export default User
