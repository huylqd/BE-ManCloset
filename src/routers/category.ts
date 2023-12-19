import express from "express";
import {
  createCategory,
  getAllCategory,
  getAllDeleteCategory,
  getCategoryById,
  remove,
  removeCategory,
  restoreCategory,
  updateCategory,
} from "../controller/categoryController";
import { checkPermission } from "../middleware/checkPermission";

const router = express.Router();
// Lấy tất cả danh mục, lấy theo id
router.get("/category", getAllCategory);
router.get("/category/:id", getCategoryById);
// Thêm sửa xóa
router.post("/category",(req, res, next) => { checkPermission(req, res, next, 'admin') }, createCategory);
router.patch("/category/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, updateCategory);
router.delete("/category/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, removeCategory);
// Chuyển danh mục vào thùng rác
router.delete("/category/remove/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, remove);
// Khôi phục danh mục
router.patch("/category/restore/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') },restoreCategory)
// Lấy tất cả danh mục trong trong thùng rác
router.get("/category/moveToTrash/delete",(req, res, next) => { checkPermission(req, res, next, 'admin') },getAllDeleteCategory)


export default router;
