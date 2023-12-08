import express from "express";
import {
  Thongketaikhoan,
  Thongkedoanhso,
  productSold,
  Thongkedonhang,
} from "../controller/analytics.controller";

const router = express.Router();

router.get("/analyst/product", productSold);
router.get("/analyst/doanhthu", Thongkedoanhso);
router.get("/analyst/user", Thongketaikhoan);
router.get("/analyst/bill", Thongkedonhang);

export default router;
