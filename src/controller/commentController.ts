import { Request, Response } from "express";
import Comment from "../model/comment";
import { commentSchema } from "../schema/commentSchema";
import { checkUserInOrder } from "../service/orderService";

export const getAllCommentByProductId = async (req: Request, res: Response) => {
  try {
    const { prd_id } = req.params;
    const comment = await Comment.find({ product_id: prd_id }).sort({
      createdAt: -1,
    });
    if (!comment) {
      res.status(404).json({
        message: "Not found comment",
      });
    }
    return res.status(200).json({
      message: "Lấy tất cả comment theo sản phẩm ",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
export const deleteCommentById = async (req: Request, res: Response) => {
  try {
    const { cmt_id } = req.params;
    const comment = await Comment.findByIdAndDelete({ _id: cmt_id });
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      })
    }
    return res.status(200).json({
      message: "Comment deleted successfully",
      data: comment

    })
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}
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

export const createComment = async (req: any, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: "Vui lòng đăng nhập để comment"
      })
    }
    const result = await checkUserInOrder(user._id);
    if (result.status === -1) {
      return res.status(200).json({
        message: "Bạn phải mua hàng để được comment",
      })
    }
    const { error } = commentSchema.validate(req.body);
    if (error) {
      const errors = error.details.map((message) => ({ message }));
      return res.status(400).json({
        message: errors,
      });
    }

    const data = {
      user_id: user._id,
      ...req.body
    };
    const comment = await Comment.create(data);
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
