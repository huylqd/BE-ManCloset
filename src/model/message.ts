import mongoose,{ Schema } from "mongoose";

const messageSchema = new Schema(
    {
        message : { 
            text: {
                type: String,
                required: true,
            },
        },
        user: Array,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Message", messageSchema)