import { orderSchema } from "../schema/orderSchema";
import Bill from "../model/order";
import { Request, Response, json } from "express";
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
  removeAccents,
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
import { sendMailOrder } from "../utils/sendMail";
import { SendMailOrderSuccess } from "../service/sendMailService";

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


type TQuery = {
  page: number | string,
  limit: number | string,
  sort: string,
  order: string,
  orderStatus: string,
  paymentStatus: string,
}
export const getBills = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    const options: TQuery = {
      page: checkInteger(+query?.page) ? +query.page - 1 : 0,
      limit: checkInteger(+query?.limit) ? +query.limit : 10,
      sort: query.sort as string || "createdAt",
      order: query.order as string || "desc",
      orderStatus: query.orderStatus as string || "Chờ xác nhận",
      paymentStatus: query.paymentStatus as string || "Chưa thanh toán",
    };

    let totalBill = await Bill.find({
      "current_order_status.status": options.orderStatus,
      "payment_status.status": options.paymentStatus,
    })

    let bills = await Bill.find({
      "current_order_status.status": options.orderStatus,
      "payment_status.status": options.paymentStatus,
    })
      .sort({
        [options.sort as string]: options.order as SortOrder,
      })
      .skip(+options.page * +options.limit)
      .limit(+options.limit)

    const results = dataQuery(totalBill, +options.limit, +options.page, totalBill.length);

    if (bills.length === 0) {
      return res.status(200).json({
        message: "Không có đơn hàng nào",
        result: results,
      });
    }

    return res.status(200).json({
      message: "Tìm kiếm đơn hàng thành công",
      result: results,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const billHistoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const order = await Bill.findById(id);
    if (!order) {
      return res.status(404).json({
        message: "Đơn hàng không tồn tại",
      });
    }

    return res.status(200).json({
      message: "Đơn hàng đã được tìm thấy",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
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

    const userOrdersHistoryAll = await Bill.find({
      user_id,
      "current_order_status.status": options.case,
    })

    const userOrdersHistory = await Bill.find({
      user_id,
      "current_order_status.status": options.case,
    })
      .sort({
        [options.sort as string]: options.order as SortOrder,
      })
      .skip(+options.limit * +options.page)
      .limit(options.limit as number);

    const results = dataQuery(userOrdersHistoryAll, +options.limit, +options.page, userOrdersHistoryAll.length);

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
    const items = req.body.items;
    console.log("item", items);

    for (const item of items) { 
      const result = await product.findOne({ _id: item.product_id });

      if (!result) {
        return res.status(404).json({ error: "Product not found" });
      }

      const selectedColor: any = result.properties.find(
        (prop) => prop.color === item.property.color
      );
      const selectedVariant = selectedColor.variants.find(
        (variant) => variant.size === item.property.size
      );

      if (
        !selectedVariant ||
        selectedVariant.quantity < item.property.quantity
      ) {
        return res.status(400).json({
          message: "Không tồn tại màu hoặc hết hàng",
          data: bill,
        });
      } else {
        selectedVariant.quantity -= item.property.quantity;
        await result.save();
      }
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


export const updateBill = async (req: Request, res: Response) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const {id} = req.params
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        message: "Không tìm thấy phiếu đặt hàng cần sửa",
      });
    }

    if(orderStatus) {
      await Bill.updateOne({
        _id: id,
      },
      {
        $push: {
          history_order_status: {
            status: orderStatus,
            updatedAt: new Date()
          }
        }
      })

      await Bill.updateOne({
        _id: id,
      },
      {
        $set: {
          current_order_status: {
            status: orderStatus,
            updatedAt: new Date()
          }
        }
      })
    }

    if (paymentStatus) {
      await Bill.updateOne({
        _id: id,
      },
      {
        $set: {
          payment_status: {
            status: paymentStatus,
            updatedAt: new Date()
          }
        }
      })
    }

    const updatedBill = await Bill.findById(id)

    if (updatedBill.current_order_status.status === "Đã xác nhận") {
      SendMailOrderSuccess(updatedBill)
    }
    if (updatedBill.current_order_status.status === "Đã giao") {
      SendMailOrderSuccess(updatedBill)
    }
    return res.status(200).json({
      message: "Phiếu đặt hàng đã được cập nhật thành công",
      data: updatedBill,
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
    console.log("item", productItem.properties, item)
    if (productItem) {
      products.push({
        productName: productItem.productName,
        size: item.property.size,
        color: item.property.color,
        quantity: item.property.quantity,
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
  console.log('products', products)
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
