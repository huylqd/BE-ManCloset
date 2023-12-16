import express from "express";
import {
  createCategory,
  getAllCategory,
  getCategoryById,
  remove,
  removeCategory,
  updateCategory,
} from "../controller/categoryController";
import { checkPermission } from "../middleware/checkPermission";

const router = express.Router();

router.get("/category", getAllCategory);
router.get("/category/:id", getCategoryById);
router.patch("/category/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, updateCategory);
router.patch("/category/remove/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, remove);
router.delete("/category/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, removeCategory);
router.post("/category",(req, res, next) => { checkPermission(req, res, next, 'admin') }, createCategory);

export default router;
