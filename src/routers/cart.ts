import express from "express";
import { wrapRequestHandler } from "../utils/handlers";
import {
  addProductToCard,
  getAllProductInCart,
} from "../controller/cart.controller";
import { checkPermission } from "../middleware/checkPermission";

const router = express.Router();

// get all product cart
router.get("/cart",(req, res, next) => {checkPermission(req, res, next, 'member')} ,wrapRequestHandler(getAllProductInCart));

// add to cart
router.post("/cart/add-to-cart", wrapRequestHandler(addProductToCard));

export default router;
