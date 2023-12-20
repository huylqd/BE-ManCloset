import express from "express"
import { addMessage, getAllMessage } from "../controller/message.js";

const router = express.Router();

router.post('/addMessage', addMessage)
router.post('/getAllMessage', getAllMessage)

export default router
