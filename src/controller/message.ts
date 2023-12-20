import dotenv from "dotenv";
import Message from "../model/message.js";

dotenv.config()


export const addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await Message.create({
            message: { text: message },
            user: [from, to],
            sender: from
        })
        if (!data) {
            return res.status(400).json({
                message: "Send message failed",
            })
        }
        return res.status(200).json({
            message: "Send message success",
        })
    } catch (error) {
        next(error)
    }
}

export const getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body
        const messages = await Message.find({
            user: {
                $all: [from, to]
            },
        }).sort({ updateAt: 1 })

        const projectMessage = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        })

        return res.status(200).json(projectMessage)
    } catch (error) {
        console.log(error);

    }
}