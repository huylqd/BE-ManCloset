import express from "express";
import {
  createComment,
  getAllComment,
  getAllCommentById,
} from "../controller/commentController";

const router = express.Router();

router.get("/comment", getAllComment);
router.get("/comment/:user_id", getAllCommentById);
router.post("/comment", createComment);

export default router;
