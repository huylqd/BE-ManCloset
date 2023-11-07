import express from "express";
import { createSale } from "../controller/saleController";

const router = express.Router();

router.post("/sale", createSale);

export default router;
