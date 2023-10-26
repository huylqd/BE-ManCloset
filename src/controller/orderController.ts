import { orderSchema } from "../schema/orderSchema";
import Bill from "../model/order";
import { Request, Response } from "express";
import User from "../model/user";

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
