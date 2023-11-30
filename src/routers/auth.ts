import express from 'express'
import { signUp, signIn, refeshToken, getAllUser, getOneUser, addNewAddess, updateAddress, deleteAddress, updateUser, getWishListByUser, removeWishList, lockUser, addRemoveWishLish } from '../controller/userController';

const router = express.Router()
router.use(express.json());

router.post("/signup", signUp)
router.post("/signIn", signIn)
router.post("/refreshToken", refeshToken)
router.get("/user", getAllUser)
router.get("/user/:id", getOneUser)
// Danh sách yêu thích
router.get("/user/:userId/wishlist",getWishListByUser)
router.patch("/user/:userId/wishlist",addRemoveWishLish)

// 
// Khóa người dùng
router.patch("/user/:userId/lock",lockUser)
// 
router.put("/addNewAddess/:id", addNewAddess)
router.put("/user/:userId/address/:addressId", updateAddress)
router.patch("/user/:id",updateUser)
router.delete("/user/:userId/address/:addressId", deleteAddress)

export default router