import { Request, Response } from "express";
import Comment from "../model/comment";
import { commentSchema } from "../schema/commentSchema";

export const getAllCommentById = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const comment = await Comment.find({ user_id: user_id }).sort({
      createAt: -1,
    });
    if (!comment) {
      res.status(404).json({
        message: "Not found comment",
      });
    }
    return res.status(200).json({
      message: "Lấy tất cả comment theo người dùng",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const getAllComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.find().sort({
      createAt: -1,
    });
    if (!comment) {
      res.status(404).json({
        message: "Not found comment",
      });
    }
    return res.status(200).json({
      message: "Lấy tất cả comment",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { error } = commentSchema.validate(req.body);
    if (error) {
      const errors = error.details.map((message) => ({ message }));
      return res.status(400).json({
        message: errors,
      });
    }
    const comment = await Comment.create(req.body);
    if (!comment) {
      return res.status(404).json({
        message: "Thêm bình luận không thành công ",
      });
    }
    return res.status(201).json({
      message: "Thêm bình luận thành công",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
