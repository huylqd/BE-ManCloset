import { orderSchema } from "../schema/orderSchema";
import Bill from "../model/order";
import { Request, Response } from "express";
import fs from "fs";
import PDFDocument from "pdfkit";
import User from "../model/user";
import product from "../model/product";
import { ProductItem } from "../interface/product";
import {
  generateCustomerInformation,
  generateFooter,
  generateHeader,
  generateInvoiceTable,
  generateTableRow,
} from "../utils/exportBill";
import {
  IOrder,
  IOrderItem,
  OrderStatus,
  PaymentStatus,
} from "../interface/order";
import { SortOrder } from "mongoose";
import { checkInteger } from "../utils/checkNumber";
import { dataQuery } from "../utils/dataQuery";

export const getAllBill = async (req: Request, res: Response) => {
  const {
    _page = 1,
    _limit = Number(_page) == 0 ? 10000000 : 2,
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
    const result = await Bill.paginate({}, options);

    if (result.docs.length === 0) {
      return res.status(400).json({
        message: "Không có phiếu đặt hàng nào",
      });
    }
    return res.status(200).json({
      message: "Danh sách phiếu đặt hàng",
      data: result.docs,
      paginate: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalDocs,
        limit: result.limit,
      },
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
    const bill = await Bill.paginate({ user_id: id }, options);
    if (!bill) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng của bạn vui lòng kiểm tra lại",
      });
    }
    return res.status(200).json({
      message: "Đơn hàng của bạn đây",
      data: bill.docs,
      paginate: {
        currentPage: bill.page,
        totalPages: bill.totalPages,
        totalItems: bill.totalDocs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const getUserOrdersHistory = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    const options = {
      page: checkInteger(+query?.page) ? +query.page - 1 : 0,
      limit: checkInteger(+query?.limit) ? +query.limit : 10,
      sort: query.sort || "createdAt",
      order: query.order || "desc",
      case: query.case || "Chờ xác nhận",
    };

    const user_id = req.params.id;

    const user = await User.findById({ _id: user_id });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userOrdersHistory = await Bill.find({
      user_id,
      "current_order_status.status": options.case,
    })
      .sort({
        [options.sort as string]: options.order as SortOrder,
      })
      .skip(+options.limit * +options.page)
      .limit(options.limit as number);

    const results = dataQuery(userOrdersHistory, +options.limit, +options.page);

    if (userOrdersHistory.length === 0) {
      return res.status(200).json({
        message: "User don't have order history",
        result: results,
      });
    }

    return res.status(200).json({
      message: "Query user order history success",
      result: results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
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
  function stringToPaymentStatus(value: string): PaymentStatus | null {
    if (Object.values(PaymentStatus).indexOf(value as PaymentStatus) >= 0) {
      return value as PaymentStatus;
    }
    return null;
  }

  function stringToOrderStatus(value: string): OrderStatus | null {
    if (Object.values(OrderStatus).indexOf(value as OrderStatus) >= 0) {
      return value as OrderStatus;
    }
    return null;
  }

  try {
    const { orderStatus, paymentStatus } = req.body;
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        message: "Không tìm thấy phiếu đặt hàng cần sửa",
      });
    }

    if (orderStatus) {
      bill.history_order_status.push({
        status: stringToOrderStatus(orderStatus),
        updatedAt: new Date(),
      });

      bill.current_order_status = {
        status: stringToOrderStatus(orderStatus),
        updatedAt: new Date(),
      };
    }

    if (paymentStatus) {
      bill.payment_status = {
        status: stringToPaymentStatus(paymentStatus),
        updatedAt: new Date(),
      };
    }

    await bill.save();

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
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="example.pdf"');
    const bills = await Bill.find({
      "order_status.status": "Đã thanh toán",
    });

    const userIds = bills.map((item) => item.user_id);
    const users = await User.find({
      _id: {
        $in: userIds,
      },
    });
    console.log("user", users);
    const exportCustom: any = await Promise.all(
      bills.map(async (bill) => {
        const user = users.filter((user) => user._id.equals(bill.user_id));
        const userName = user[0].name;
        return { ...bill, userName: userName };
      })
    );

    if (exportCustom.length === 0) {
      return res.status(400).json({
        message: "Không có hóa đơn nào",
      });
    }
    console.log("custom user", exportCustom);

    // Tạo tệp PDF

    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(res);
    for (const bill of exportCustom) {
      const products: ProductItem[] = [];
      // console.log("bill docs", bill._doc);
      for (const item of bill._doc.items) {
        const productItem = await product.findOne({ _id: item.product_id });
        console.log("productname", productItem);
        products.push({
          productName: productItem?.productName,
          size: item?.property?.size,
          color: item?.property?.color,
          quantity: item?.property?.quantity,
          price: item?.price,
          subTotal: item?.sub_total,
          description: productItem?.description,
        });
      }
      pdfDoc.text(`ID Hóa Đơn: ${bill?._doc?._id}`);
      pdfDoc.text(`Ngày Xuất Hóa Đơn: ${bill?._doc?.createdAt}`);
      pdfDoc.text(`Tên người gửi: Man Closet`);
      pdfDoc.text(`Địa chỉ người gửi: ngõ 53 tân triều thanh trì hà nội`);
      pdfDoc.text(`Tên người nhận: ${bill?.userName}`);
      pdfDoc.text(`Địa chỉ người nhận: ${bill?._doc?.shipping_address}`);
      pdfDoc.text(
        `Sản phẩm bao gồm có: ${products
          .map(
            (product) =>
              `${product?.productName} - ${product.size} - ${product.color} - ${product.quantity} - ${product.price}`
          )
          .join(", ")}`
      );
      pdfDoc.text(`Tổng tiền: ${bill?.docs.totalPrice}`, {
        format: { bold: true },
      });
      pdfDoc.moveDown();
    }

    pdfDoc.end();

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
    //tìm sản phẩm bán chạy nhất
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

export const exportBillById = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="example.pdf"');
  try {
    const bill_id = req.params.bill_id;
    const bill = await getBillInfo(bill_id);

    if (bill) {
      const user = await getUserInfo(String(bill.user_id));
      if (user) {
        bill.userName = user.name;
      }

      const products = await getProductsInfo(bill.items);

      createInvoice(res, bill, products);
    } else {
      throw new Error("Bill not found");
    }
  } catch (error) {
    console.error("Error exporting bill:", error);
    return res.status(500).json({ error: "Error exporting bill" });
  }
};

async function getBillInfo(bill_id: string) {
  return await Bill.findById({ _id: bill_id }).lean();
}

async function getUserInfo(user_id: string | undefined) {
  return await User.findById({ _id: user_id });
}

async function getProductsInfo(items: IOrderItem[]) {
  const products: ProductItem[] = [];
  const promises = items.map(async (item) => {
    const productItem = await product.findById({ _id: item.product_id });
    if (productItem) {
      products.push({
        productName: productItem.productName,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
        subTotal: item.sub_total,
        description: productItem.description,
      });
    }
  });
  await Promise.all(promises);
  return products;
}

function createInvoice(res: Response, bill: any, products: ProductItem[]) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  const invoiceTableTop = 330;
  generateCustomerInformation(doc, bill);

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Name",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateInvoiceTable(doc, products, bill);
  generateFooter(doc);

  doc.pipe(res);
  doc.end();
}
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
    return error.message;
  }
};
