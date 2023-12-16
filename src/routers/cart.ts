import express from "express";
import { wrapRequestHandler } from "../utils/handlers";
import {
  addProductToCard,
  deleteProductInCart,
  getAllProductInCart,
} from "../controller/cart.controller";
import { checkPermission } from "../middleware/checkPermission";

const router = express.Router();

// get all product cart
router.get("/cart",(req, res, next) => {checkPermission(req, res, next, 'member')} ,wrapRequestHandler(getAllProductInCart));

// add to cart
router.patch("/cart/add-to-cart", (req, res, next) => {checkPermission(req, res, next, 'member')} ,wrapRequestHandler(addProductToCard));

// delete product
router.put("/cart/:id", deleteProductInCart)

export default router;
