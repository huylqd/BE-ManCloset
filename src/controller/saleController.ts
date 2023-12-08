import { Request, Response } from "express";
import Sale from "../model/sale";
import * as cron from "node-cron";
import Product from "../model/product";
export const createSale = async (req: Request, res: Response) => {
  try {
    const {
      discountPercentage,
      categoryId,
      startDate,
      endDate,
      numberOfProductsToDiscount,
    } = req.body;
    const sale = await Sale.find({ categoryId: categoryId });
    if (sale.length === 0) {
      // Tạo một cuộc giảm giá mới
      const newSale = new Sale({
        discountPercentage: discountPercentage,
        categoryId: categoryId,
        startDate: Date.now(),
        endDate: Date.now() + 1000 * 60,
      });

      // Lưu cuộc giảm giá vào cơ sở dữ liệu
      await newSale.save();

      // Lấy danh sách sản phẩm để áp dụng giảm giá
      const products = await Product.find({ categoryId: categoryId });
      // console.log(products);

      // Trộn lại mảng products
      const shuffledProducts = products.sort(() => Math.random() - 0.5);

      for (
        let i = 0;
        i < numberOfProductsToDiscount && i < shuffledProducts.length;
        i++
      ) {
        const product = shuffledProducts[i];
        const discount = discountPercentage;
        product.discount = discount;
        await Product.updateOne({ _id: product._id }, product);
      }
      // console.log(products);

      return res.json({
        message: "Cuộc giảm giá đã được tạo và áp dụng vào sản phẩm",
      });
    } else {
      return res.json({
        message: "Cuộc giảm giá tại danh mục này đã được tạo",
      });
    }
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ error: "Có lỗi" });
  }
};

// Lên lịch kiểm tra cuộc giảm giá kết thúc hàng ngày
const task = cron.schedule("* * * * *", async () => {
  try {
    const currentDate = new Date();

    // Tìm tất cả các cuộc giảm giá đã kết thúc
    const expiredSales: any = await Sale.find({
      endDate: { $lt: currentDate },
    });
    // console.log(expiredSales);

    // Duyệt qua danh sách các cuộc giảm giá đã kết thúc và xóa chúng
    for (const sale of expiredSales) {
      await Sale.findByIdAndDelete(sale._id);
    }
    // Duyệt qua từng cuộc giảm giá đã kết thúc và cập nhật sản phẩm
    for (const sale of expiredSales) {
      const productsToUpdate = await Product.find({
        categoryId: sale.categoryId,
      });

      productsToUpdate.forEach(async (product) => {
        // Cập nhật giá sale về 0
        product.discount = 0;
        await Product.updateOne({ _id: product._id }, product);
      });
    }

    // console.log("Giá giảm giá đã được cập nhật");
  } catch (error) {
    console.error("Lỗi:", error);
  }
});

export const isCheckedSale = () => {
  task.start();
};
