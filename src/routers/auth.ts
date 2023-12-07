import express from 'express'
import { signUp, signIn, refeshToken, getAllUser, getOneUser, addNewAddress, updateAddress, deleteAddress, updateUser, getUserAddress } from '../controller/userController';
import { checkPermission } from '../middleware/checkPermission';

const router = express.Router()
router.use(express.json());

router.post("/signup", signUp)
router.post("/signIn", signIn)
router.post("/refreshToken", refeshToken)
router.get("/user",(req, res, next) => {checkPermission(req, res, next, 'admin')}, getAllUser)
router.get("/user/:id", getOneUser)
router.put("/addNewAddress/:id",(req, res, next) => {checkPermission(req, res, next, 'member')}, addNewAddress)
router.patch("/user/:userId/address/:addressId",(req, res, next) => {checkPermission(req, res, next, 'member')}, updateAddress)
router.patch("/user/:id",updateUser)
router.delete("/user/:userId/address/:addressId",(req, res, next) => {checkPermission(req, res, next, 'member')}, deleteAddress)
router.get("/user/:id/address", getUserAddress)

export default router