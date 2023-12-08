import Bill from "../model/order";
import { Request, Response } from "express";
import User from "../model/user";

export const productSold = async (req: Request, res: Response) => {
  // Lấy ngày bắt đầu và kết thúc của tháng hiện tại
  const startDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const endDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );

  try {
    //tìm sản phẩm bán chạy nhất
    const result = await Bill.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $unwind: "$items", // Mở rộng mảng 'items' thành các bản ghi riêng lẻ
      },
      {
        $group: {
          _id: "$items.product_id", // Nhóm theo product_id
          totalQuantitySold: { $sum: "$items.property.quantity" }, // Tính tổng số lượng đã bán
          totalAmountSold: { $sum: "$items.sub_total" },
        },
      },
      {
        $project: {
          _id: 0, // Loại bỏ trường _id
          product_id: "$_id", // Đặt lại tên trường product_id
          totalQuantitySold: 1, // Giữ lại trường totalQuantitySold
          totalAmountSold: 1,
        },
      },
      {
        $sort: {
          totalQuantitySold: -1, // Sắp xếp theo số lượng giảm dần
        },
      },
    ]).exec();
    return res.status(200).json({
      message: "Sản phẩm bán chạy",
      data: result,
    });
  } catch (error) {
    return error.message;
  }
};
export const Thongkedoanhso = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const result = await Bill.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmountSold: { $sum: "$total_price" },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmountSold: 1,
        },
      },
    ]).exec();
    return res.status(200).json({
      message: "Doanh thu",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const Thongketaikhoan = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const result = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalNewUsers: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalNewUsers: 1,
        },
      },
    ]).exec();
    return res.status(200).json({
      message: "Tài khoản mới trong tháng",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const Thongkedonhang = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const result = await Bill.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
        },
      },
    ]).exec();
    return res.status(200).json({
      message: "Đơn trong tháng",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
