import express from 'express'
import { signUp, signIn, refeshToken, getAllUser, getOneUser, addNewAddess, updateAddress, deleteAddress, updateUser, getWishListByUser, removeWishList, lockUser, addRemoveWishLish } from '../controller/userController';

import { checkPermission } from '../middleware/checkPermission';

const router = express.Router()
router.use(express.json());

router.post("/signup", signUp)
router.post("/signIn", signIn)
router.post("/refreshToken", refeshToken)
router.get("/user", getAllUser)
router.get("/user/:id", getOneUser)
// Danh sách yêu thích
router.get("/user/:userId/wishlist", getWishListByUser)
router.patch("/user/wishlist", (req, res, next) => { checkPermission(req, res, next, 'member') }, addRemoveWishLish)

// 
// Khóa người dùng
router.patch("/user/:userId/lock", lockUser)
// 

router.put("/addNewAddess/:id", (req, res, next) => { checkPermission(req, res, next, 'member') }, addNewAddess)
router.put("/user/:userId/address/:addressId", (req, res, next) => { checkPermission(req, res, next, 'member') }, updateAddress)
router.patch("/user/:id", updateUser)
router.delete("/user/:userId/address/:addressId", (req, res, next) => { checkPermission(req, res, next, 'member') }, deleteAddress)

export default router