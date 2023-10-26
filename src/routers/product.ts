import express, { Router } from "express";
import {
  createProduct,
  getProductById,
  getAllProduct,
  removeProduct,
  updateProduct,
} from "../controller/productController";

const router: Router = express.Router();
router.get("/products", getAllProduct);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", removeProduct);

export default router;
