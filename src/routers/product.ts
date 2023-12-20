import express, { Router } from "express";
const multer = require('multer');
import {
  createProduct,
  getProductById,
  getAllProduct,
  updateProduct,
  getProductByCategoryId,
  FilterProductBySize,
  FilterProductByPrice,
  remove,
  getAllDelete,
  restoreProduct,
  removeForce,
  getProductDeletedById,
  getInventoryOfProduct,
  ImportProductByExcel,
  queryProductByCateId,
  
} from "../controller/productController";
import { uploadImage } from "../config/cloudinary";
import { checkPermission } from "../middleware/checkPermission";

const router: Router = express.Router();
// Lấy tất cả sản phẩm, lấy theo id, lấy theo cateId
router.get("/products",getAllProduct);
router.get("/products/:id", getProductById);
// router.get("/products/cate/filter", queryProductByCateId);
router.get("/products/cate/:categoryId", getProductByCategoryId);
// Thêm , update, xóa sản phẩm
router.post("/products", (req, res, next) => { checkPermission(req, res, next, 'admin') }, uploadImage.array("images",5) ,createProduct);
router.patch("/products/:id", (req, res, next) => { checkPermission(req, res, next, 'admin') },uploadImage.array("images",5) ,updateProduct);
router.delete("/products/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, removeForce);

// Khôi phục sản phẩm
router.patch("/products/restore/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') },restoreProduct)
// Chuyển sản phẩm vào trong thùng rác
router.delete("/products/remove/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, remove);
// Lấy tất cả sản phẩm ở trong thùng rác
router.get("/products/moveToTrash/delete",(req, res, next) => { checkPermission(req, res, next, 'admin') }, getAllDelete);
router.get("/products/moveToTrash/delete/:id",(req, res, next) => { checkPermission(req, res, next, 'admin') }, getProductDeletedById);
// 


// Filter
router.get("/products/size/filter",FilterProductBySize)
router.get("/products/price/filter",FilterProductByPrice)

router.get("/products/:id/inventory", getInventoryOfProduct)

//import
// Cấu hình Multer để xử lý tệp tải lên
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/upload', upload.single('file'), ImportProductByExcel);
export default router;
