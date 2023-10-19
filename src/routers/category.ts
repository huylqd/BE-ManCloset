import express from "express";
import {
  createCategory,
  getAllCategory,
  getCategoryById,
  removeCategory,
  updateCategory,
} from "../controller/categoryController";

const router = express.Router();

router.get("/category", getAllCategory);
router.get("/category/:id", getCategoryById);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", removeCategory);
router.post("/category", createCategory);

export default router;
