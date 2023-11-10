import express from "express";
import { wrapRequestHandler } from "../utils/handlers";
import {
  addProductToCard,
  getAllProductInCart,
} from "../controller/cart.controller";

const router = express.Router();

// get all product cart
router.get("/cart/:user_id", wrapRequestHandler(getAllProductInCart));

// add to cart
router.post("/cart/add-to-cart", wrapRequestHandler(addProductToCard));

export default router;
