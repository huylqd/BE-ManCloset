import express from 'express'
import { signUp, signIn, refeshToken, getAllUser, getOneUser, addNewAddess, updateAddress, deleteAddress, updateUser } from '../controller/userController';
import { checkPermission } from '../middleware/checkPermission';

const router = express.Router()
router.use(express.json());

router.post("/signup", signUp)
router.post("/signIn", signIn)
router.post("/refreshToken", refeshToken)
router.get("/user",(req, res, next) => {checkPermission(req, res, next, 'admin')}, getAllUser)
router.get("/user/:id", getOneUser)
router.put("/addNewAddess/:id", addNewAddess)
router.put("/user/:userId/address/:addressId", updateAddress)
router.patch("/user/:id",updateUser)
router.delete("/user/:userId/address/:addressId", deleteAddress)

export default router