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
import { checkPermission } from "../middleware/checkPermission";

const router: Router = express.Router();
router.get("/products",getAllProduct);
router.get("/products/:id", getProductById);
router.get("/products/cate/:categoryId", getProductByCategoryId);

router.post("/products", (req, res, next) => { checkPermission(req, res, next, 'admin') },createProduct);
router.patch("/products/:id", (req, res, next) => { checkPermission(req, res, next, 'admin') },updateProduct);
router.delete("/products/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, removeProduct);
// Filter
router.get("/products/filter/:size",FilterProductBySize)
router.get("/products/price/filter",FilterProductByPrice)

export default router;
