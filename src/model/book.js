import { string } from "joi";
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const bookSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price :{ 
        type: Number
    },
    description: {
        type: String
    },
    image: {
        type: String
    }
},{timestamps: true, versionKey:false})

bookSchema.plugin(mongoosePaginate)

export default mongoose.model("Book", bookSchema)