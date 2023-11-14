import { orderSchema } from "../schema/orderSchema";
import Bill from "../model/order";
import { Request, Response } from "express";
import fs from "fs";
import PDFDocument from "pdfkit";
import User from "../model/user";
import product from "../model/product";
import { ProductItem } from "../interface/product";

export const getAllBill = async (req: Request, res: Response) => {
  try {
    const bills = await Bill.find();
    if (bills.length === 0) {
      return res.status(400).json({
        message: "Không có phiếu đặt hàng nào",
      });
    }
    return res.status(200).json({
      message: "Danh sách phiếu đặt hàng",
      data: bills,
    });
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

/* Postman create a new bill : req.body
    {
    "user_id":"65314ba0d0253dbb606a1c4e",
    "shipping_address":"Ninh Bình",
    "items":[
        {
            "product_id":"6530d9f81dfde459a5fd287a",
            "price": 20000,
            "property":{
                "quantity":2,
                "color":"vàng",
                "size":"M"
            },
            "sub_total":40000
        }
    ],
    "total_price":40000
    }
*/

export const billHistoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const billById = await Bill.findById(id);
    if (!billById) {
      return res.status(404).json({
        message: "không tìm thấy đơn hàng của bạn kiểm tra lại",
      });
    }
    return res.json(200).json({
      message: "Lịch sử đặt hàng của bạn",
      data: billById,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const billHistoryByUserId = async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const bill = await Bill.find({ user_id: id }).sort({
      createAt: -1,
    });

    if (!bill) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng của bạn vui lòng kiểm tra lại",
      });
    }
    return res.status(200).json({
      message: "Đơn hàng của bạn đây",
      data: bill,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const createBill = async (req: Request, res: Response) => {
  try {
    const { error } = orderSchema.validate(req.body);
    if (error) {
      console.log("error", error);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const newBill = new Bill(req.body);
    const bill = await newBill.save();
    if (!bill) {
      return res.status(400).json({
        message: "Không thể tạo danh mục",
      });
    }
    return res.status(201).json({
      message: "Phiếu đặt hàng đã được tạo",
      data: bill,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

//Chỉ gửi lên status mới ghi thế đã đợi nghĩ và phát triển thêm
export const updateBill = async (req: Request, res: Response) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bill) {
      return res.status(400).json({
        message: "Không tìm thấy phiếu đặt hàng cần sửa",
      });
    }
    return res.status(200).json({
      message: "Phiếu đặt hàng đã được cập nhật thành công",
      data: bill,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const exportBill = async (req: Request, res: Response) => {
  try {
    const bills = await Bill.find({
      "history_order_status.status": "đã thanh toán",
    });
    const userIds = bills.map((item) => item.user_id);
    const users = await User.find({
      _id: {
        $in: userIds,
      },
    });

    const exportCustom = bills.map((bill) => {
      const user = users.find((user) => user._id == bill.user_id);
      const userName = user.name;
      return {
        ...bill,
        userName: userName,
      };
    });
    if (exportCustom.length === 0) {
      return res.status(400).json({
        message: "Không có hóa đơn nào",
      });
    }

    // Tạo tệp PDF
    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream("bills.pdf"));

    exportCustom.forEach(async (bill) => {
      const products: ProductItem[] = [];
      for (const item of bill.items) {
        const productItem = await product.findOne({ _id: item.product_id });
        products.push({
          productName: productItem.productName,
          size: item.property.size,
          color: item.property.color,
          quantity: item.property.quantity,
          price: item.price,
          subTotal: item.sub_total,
        });
      }
      pdfDoc.text(`ID Hóa Đơn: ${bill._id}`);
      pdfDoc.text(`Ngày Xuất Hóa Đơn: ${bill.createdAt}`);
      pdfDoc.text(`Tên người gửi: Man Closet`);
      pdfDoc.text(`Địa chỉ người gửi: ngõ 53 tân triều thanh trì hà nội`);
      pdfDoc.text(`Tên người nhận: ${bill.userName}`);
      pdfDoc.text(`Địa chỉ người nhận: ${bill.shipping_address}`);
      pdfDoc.text(
        `Sản phẩm bao gồm có: ${products
          .map(
            (product) =>
              `${product.productName} - ${product.size} - ${product.color} - ${product.quantity} - ${product.price}`
          )
          .join(", ")}`
      );
      pdfDoc.text(
        `Tổng tiền: ${products.map((product) => product.subTotal).join(", ")}`,
        { format: { bold: true } }
      );
      pdfDoc.moveDown();
    });

    pdfDoc.end(); // Kết thúc và lưu tệp

    return res.status(200).json({
      message: "Danh sách hóa đơn đã được xuất ra tệp PDF",
      data: exportCustom,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

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
  try {
    const result = await Bill.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeek,
            $lte: endOfWeek,
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
