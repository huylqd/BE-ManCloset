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
const wishListSchema = new mongoose.Schema({
  name:{type:String,require:true},
  imageUrl:{type:String,require:true},
  price:{type:Number,require:true}
})

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: Schema.Types.String,
    maxLength: 255,
  },
  avatar:{
    type:String,
    require:true
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
  phone:{
    type:Number,
    
  },
  wishList:{
    type:[wishListSchema],
    required:true,
    default:[]
  },
  isBlocked:{
    type: Boolean,
    default:false,
  },
  role: {
    type: String,
    default: "member"
  },
    googleId: {
      type: String,
      default: null,
  },
  authType: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },
},
  { timestamps: true, versionKey: false }

);
userSchema.plugin(mongoosePaginate)
const User = mongoose.model<IUser, mongoose.PaginateModel<IUser>>(
  "Users",
  userSchema
);
export default User
