import express from "express";
import { createSale } from "../controller/saleController.js";

const router = express.Router();

router.post("/sale", createSale);

export default router;
