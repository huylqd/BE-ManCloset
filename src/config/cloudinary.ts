import { v2 as cloudinary } from "cloudinary";

import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from "multer"
import dotenv from "dotenv"

dotenv.config()
const {CLOUDINARY_NAME,CLOUDINARY_KEY,CLOUDINARY_SECRET} = process.env
cloudinary.config({
    cloud_name:CLOUDINARY_NAME,
    api_key:CLOUDINARY_KEY,
    api_secret:CLOUDINARY_SECRET
})


const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'jpeg'],
    params: {
      folder: 'image_mancloset'
    } 
} as any);


 export const uploadImage = multer({storage})
 export default cloudinary;

