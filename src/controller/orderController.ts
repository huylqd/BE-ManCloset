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

export const billHistoryByUserId = async (req: any, res: Response) => {
  const {
    _page = 1,
    _limit = _page == 0 ? 1000000000 : 1,
    _sort = "createdAt",
    _order = "asc",
    _expand,
  } = req.query;
  const options: any = {
    page: _page,
    limit: _limit,
    sort: { [_sort as string]: _order === "desc" ? -1 : 1 },
  };
  try {
    const id = req.params.userId;
    const bill = await Bill.paginate({ user_id: id },options)

    if (!bill) {
      return res.status(404).json({ 
        message: "Không tìm thấy đơn hàng của bạn vui lòng kiểm tra lại",
      });
    }
    return res.status(200).json({
      message: "Đơn hàng của bạn đây",
      data: bill.docs,
      paginate:{
        currentPage: bill.page,
        totalPages: bill.totalPages,
        totalItems: bill.totalDocs,
      }
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
      "history_order_status.status": "Đã thanh toán",
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
    
    });
    pdfDoc.moveDown();

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
