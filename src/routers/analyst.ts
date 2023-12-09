import express from "express";
import {
  Thongketaikhoan,
  Thongkedoanhso,
  productSold,
  Thongkedonhang,
} from "../controller/analytics.controller";
import { checkPermission } from "../middleware/checkPermission";

const router = express.Router();

router.get("/analyst/product",(req, res, next) => { checkPermission(req, res, next, 'admin') }, productSold);
router.get("/analyst/doanhthu",(req, res, next) => { checkPermission(req, res, next, 'admin') }, Thongkedoanhso);
router.get("/analyst/user", (req, res, next) => { checkPermission(req, res, next, 'admin') },Thongketaikhoan);
router.get("/analyst/bill",(req, res, next) => { checkPermission(req, res, next, 'admin') }, Thongkedonhang);

export default router;
