import express from 'express'
import { signUp, signIn, refeshToken, getAllUser, getOneUser, addNewAddess } from '../controller/userController';

const router = express.Router()
router.use(express.json());

router.post("/signup", signUp)
router.post("/signIn", signIn)
router.post("/refreshToken", refeshToken)
router.get("/user", getAllUser)
router.get("/user/:id", getOneUser)
router.put("/addNewAddess/:id", addNewAddess)

export default router