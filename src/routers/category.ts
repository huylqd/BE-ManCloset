import express from "express";
import {
  createCategory,
  getAllCategory,
  getCategoryById,
  removeCategory,
  updateCategory,
} from "../controller/categoryController";

const router = express.Router();

router.get("", getAllCategory);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", removeCategory);
router.post("", createCategory);

export default router;
