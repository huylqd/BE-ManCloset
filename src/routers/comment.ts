import express from "express";
import {
  createComment,
  deleteCommentById,
  getAllComment,

  getAllCommentByProductId,
} from "../controller/commentController.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.get("/comment", getAllComment);
router.get("/comment/:prd_id", getAllCommentByProductId);
router.delete("/comment/:cmt_id", deleteCommentById);

router.post("/comment", (req, res, next) => { checkPermission(req, res, next, 'member') }, createComment);

export default router;
