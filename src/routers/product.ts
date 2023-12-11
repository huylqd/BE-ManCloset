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
  
} from "../controller/productController";
import { uploadImage } from "../config/cloudinary";
import { checkPermission } from "../middleware/checkPermission";

const router: Router = express.Router();
router.get("/products",getAllProduct);
router.get("/products/:id", getProductById);
router.get("/products/cate/:categoryId", getProductByCategoryId);

router.post("/products", uploadImage.array('images', 5),createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", removeProduct);
// Filter
router.get("/products/filter/:size",FilterProductBySize)
router.get("/products/price/filter",FilterProductByPrice)

export default router;
