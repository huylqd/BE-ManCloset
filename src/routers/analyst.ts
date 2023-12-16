import express from "express";
import {
  Thongketaikhoan,
  Thongkedoanhso,
  productSold,
  Thongkedonhang,
  topUserMuaHang,
} from "../controller/analytics.controller";
import { checkPermission } from "../middleware/checkPermission";

const router = express.Router();

router.post(
  "/analyst/product",
  (req, res, next) => {
    checkPermission(req, res, next, "admin");
  },
  productSold
);
router.post(
  "/analyst/doanhthu",
  (req, res, next) => {
    checkPermission(req, res, next, "admin");
  },
  Thongkedoanhso
);
router.post(
  "/analyst/user",
  (req, res, next) => {
    checkPermission(req, res, next, "admin");
  },
  Thongketaikhoan
);
router.post(
  "/analyst/bill",
  (req, res, next) => {
    checkPermission(req, res, next, "admin");
  },
  Thongkedonhang
);
router.post(
  "/analyst/top5User",
  (req, res, next) => {
    checkPermission(req, res, next, "admin");
  },
  topUserMuaHang
);

export default router;
