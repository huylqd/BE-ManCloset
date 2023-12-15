import express from 'express'
import { signUp, signIn, refeshToken, getAllUser, getOneUser, updateAddress, deleteAddress, updateUser, getWishListByUser, removeWishList, lockUser, addRemoveWishLish, getUserAddress, addNewAddress, updateAvatar } from '../controller/userController';

import { checkPermission } from '../middleware/checkPermission';
import { uploadImage } from '../config/cloudinary';

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

router.put("/addNewAddress/:id", (req, res, next) => { checkPermission(req, res, next, 'member') }, addNewAddress)
router.patch("/user/:userId/address/:addressId", (req, res, next) => { checkPermission(req, res, next, 'member') }, updateAddress)
router.patch("/user/:id", updateUser)
router.delete("/user/:userId/address/:addressId", (req, res, next) => { checkPermission(req, res, next, 'member') }, deleteAddress)
router.get("/user/:id/address", getUserAddress)
router.patch("/user/:userId/avatar", uploadImage.array("avatar", 5), updateAvatar)
export default router