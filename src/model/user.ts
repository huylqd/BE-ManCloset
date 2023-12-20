import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/user";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseDelete from "mongoose-delete";
const addressSchema = new mongoose.Schema(
  {
    city: {
      type: String, 
      required: true
    },
    district: {
      type: String, 
      required: true
    },
    wards: {
      type: String, 
      required: true
    },
    detailAddress: {
      type: String, 
      required: false
    },
    isDefault: {
      type:Boolean,
      default: false
    }
  },{
    versionKey: false
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
    require:true,
    default: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg"
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
    type: String,
    default: ""
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
  passwordResetToken: {
    type: String
},
passwordResetExpires: {
    type: Number
},
passwordChangeAt: {
    type: Number
},
},
  { timestamps: true, versionKey: false }
);
userSchema.plugin(mongoosePaginate)
userSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt : true  });
const User = mongoose.model<IUser, mongoose.PaginateModel<IUser>>(
  "Users",
  userSchema
);
export default User
