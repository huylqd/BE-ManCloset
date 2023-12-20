import Bill from "../model/order";
import { Request, Response } from "express";
import User from "../model/user";

// Lấy ngày bắt đầu và kết thúc của tháng hiện tại
const startOfMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1
);
const endOfMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0
);
// Lấy ngày bắt đầu và kết thúc của ngày hiện tại
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);
// Lấy ngày bắt đầu và kết thúc của năm hiện tại
const startOfYear = new Date(new Date().getFullYear(), 0, 1);
const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);
// Lấy ngày bắt đầu và kết thúc của tuần hiện tại
const currentDate = new Date();
const startOfWeek = new Date(
  currentDate.setDate(currentDate.getDate() - currentDate.getDay())
); // Ngày đầu tuần (chủ nhật)
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(endOfWeek.getDate() + 6); // Ngày cuối tuần (thứ bảy)

export const productSold = async (req: Request, res: Response) => {
  try {
    const { filter } = req.body;
    let startDate, endDate;
    if (filter === "Ngày") {
      startDate = startOfDay;
      endDate = endOfDay;
    }
    if (filter === "Tuần") {
      startDate = startOfWeek;
      endDate = endOfWeek;
    }
    if (filter === "Tháng" || !filter) {
      startDate = startOfMonth;
      endDate = endOfMonth;
    }
    if (filter === "Năm") {
      startDate = startOfYear;
      endDate = endOfYear;
    }
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
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.product_id",
          totalQuantitySold: { $sum: "$items.property.quantity" },
          totalAmountSold: { $sum: "$items.sub_total" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $unwind: {
          path: "$productDetails.properties",
          preserveNullAndEmptyArrays: true,
        },
      },{
        $limit:5
      },
      {
        $project: {
          _id: 0,
          product_id: "$_id",
          totalQuantitySold: 1,
          totalAmountSold: 1,
          productName: "$productDetails.productName",
          productImage: "$productDetails.properties.imageUrl",
        },
      },
      {
        $sort: {
          totalQuantitySold: -1,
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
    const { filter } = req.body;
    let startDate, endDate;
    if (filter === "Ngày") {
      startDate = startOfDay;
      endDate = endOfDay;
    }
    if (filter === "Tuần") {
      startDate = startOfWeek;
      endDate = endOfWeek;
    }
    if (filter === "Tháng" || !filter) {
      startDate = startOfMonth;
      endDate = endOfMonth;
    }
    if (filter === "Năm") {
      startDate = startOfYear;
      endDate = endOfYear;
    }
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
    const { filter } = req.body;
    let startDate, endDate;
    if (filter === "Ngày") {
      startDate = startOfDay;
      endDate = endOfDay;
    }
    if (filter === "Tuần") {
      startDate = startOfWeek;
      endDate = endOfWeek;
    }
    if (filter === "Tháng" || !filter) {
      startDate = startOfMonth;
      endDate = endOfMonth;
    }
    if (filter === "Năm") {
      startDate = startOfYear;
      endDate = endOfYear;
    }
    const result = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
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
    const { filter } = req.body;
    let startDate, endDate;
    if (filter === "Ngày") {
      startDate = startOfDay;
      endDate = endOfDay;
    }
    if (filter === "Tuần") {
      startDate = startOfWeek;
      endDate = endOfWeek;
    }
    if (filter === "Tháng" || !filter) {
      startDate = startOfMonth;
      endDate = endOfMonth;
    }
    if (filter === "Năm") {
      startDate = startOfYear;
      endDate = endOfYear;
    }
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
export const topUserMuaHang = async (req: Request, res: Response) => {
  try {
    const { filter } = req.body;
    let startDate, endDate;
    if (filter === "Ngày") {
      startDate = startOfDay;
      endDate = endOfDay;
    }
    if (filter === "Tuần") {
      startDate = startOfWeek;
      endDate = endOfWeek;
    }
    if (filter === "Tháng" || !filter) {
      startDate = startOfMonth;
      endDate = endOfMonth;
    }
    if (filter === "Năm") {
      startDate = startOfYear;
      endDate = endOfYear;
    }
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
        $group: {
          _id: "$user_id", // Nhóm theo user_id
          totalSpent: { $sum: "$total_price" }, // Tính tổng số tiền đã chi tiêu
        },
      },
      {
        $sort: {
          totalSpent: -1, // Sắp xếp theo tổng số tiền giảm dần
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "users", // Tên của bảng Users
          localField: "_id", // Trường cần so sánh trong bảng Order
          foreignField: "_id", // Trường cần so sánh trong bảng Users
          as: "userDetails", // Tên của trường chứa thông tin người dùng
        },
      },
      {
        $unwind: "$userDetails", // Mở rộng mảng 'userDetails' thành các bản ghi riêng lẻ
      },
      {
        $project: {
          _id: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          totalSpent: 1,
        },
      },
    ]).exec();

    return res.status(200).json({
      message: "Top 5 khách hàng chi tiêu nhiều",
      data: result,
    });
  } catch (error) {
    return error.message;
  }
};
