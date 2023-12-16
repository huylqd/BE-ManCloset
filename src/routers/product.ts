import express, { Router } from "express";
import {
  createProduct,
  getProductById,
  getAllProduct,
  removeProduct,
  updateProduct,
  getProductByCategoryId,
  FilterProductBySize,
  FilterProductByPrice,
  remove,
  getAllDeleted,
  
} from "../controller/productController";
import { uploadImage } from "../config/cloudinary";
import { checkPermission } from "../middleware/checkPermission";

const router: Router = express.Router();
router.get("/products",getAllProduct);
router.get("/products/:id", getProductById);
router.get("/products/cate/:categoryId", getProductByCategoryId);
router.get("/products/deleted", getAllDeleted);

router.post("/products", (req, res, next) => { checkPermission(req, res, next, 'admin') }, uploadImage.array("images",5) ,createProduct);
router.patch("/products/:id", (req, res, next) => { checkPermission(req, res, next, 'admin') },uploadImage.array("images",5) ,updateProduct);
router.delete("/products/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, removeProduct);
// Filter
router.patch("/products/remove/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, remove);
router.get("/products/size/filter",FilterProductBySize)
router.get("/products/price/filter",FilterProductByPrice)

export default router;
