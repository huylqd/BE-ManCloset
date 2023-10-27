import express from 'express'
import { signUp, signIn, refeshToken } from '../controller/userController';

const router = express.Router()
router.use(express.json());

router.post("/signup", signUp)
router.post("/signIn", signIn)
router.post("/refreshToken", refeshToken)

export default router