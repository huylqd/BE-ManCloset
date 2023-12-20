import express from "express";
import { wrapRequestHandler } from "../utils/handlers.js";
import {
  addProductToCard,
  deleteProductInCart,
  getAllProductInCart,
  updateProductInCart,
} from "../controller/cart.controller.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

// get all product cart
router.get("/cart", (req, res, next) => { checkPermission(req, res, next, 'member') }, wrapRequestHandler(getAllProductInCart));

// add to cart
router.patch("/cart/add-to-cart", (req, res, next) => { checkPermission(req, res, next, 'member') }, wrapRequestHandler(addProductToCard));

// delete product
router.put("/cart/:id", deleteProductInCart)
// update product in cart
router.patch("/cart/:user_id/product/:id", updateProductInCart)

export default router;
