import express from "express";
import {
  createComment,
  getAllComment,

  getAllCommentByProductId,
} from "../controller/commentController";
import { checkPermission } from "../middleware/checkPermission";

const router = express.Router();

router.get("/comment", getAllComment);
router.get("/comment/:prd_id", getAllCommentByProductId);
router.post("/comment", (req, res, next) => { checkPermission(req, res, next, 'member') }, createComment);

export default router;
