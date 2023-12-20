import { Request, Response } from "express";
import { IProduct, IProductResponse } from "../interface/product";
import Category from "../model/category";
import Product from "../model/product";
import { productSchema } from "../schema/productSchema";
import cloudinary from "../config/cloudinary";
import { checkInteger } from "../utils/checkNumber";
import { dataQuery, dataQueryPaginate } from "../utils/dataQuery";
import product from "../model/product";
import { SortOrder } from "mongoose";
const ExcelJS = require("exceljs");

export const getAllProduct = async (req: any, res: any) => {
  const {
    _page = 1,
    _limit = _page == 0 ? 10000000 : 8,
    _sort = "createdAt",
    _order = "desc",
    _expand,
  } = req.query;
  const options: any = {
    page: _page,
    limit: _limit,
    sort: { [_sort as string]: _order === "desc" ? -1 : 1 },
  };
  try {
    const result = await Product.paginate({}, options);
    if (result.docs.length === 0) throw new Error("No products found");
    const response: IProductResponse = {
      data: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalDocs,
      },
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) throw new Error("Product not found");
    product.views++;
    await product.save();
    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export const getProductDeletedById = async (req: Request, res: Response) => {
  try {
    const product = await (Product as any).findWithDeleted({
      _id: req.params.id,
    });
    if (!product) throw new Error("Product not found");

    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createProduct = async (req: any, res: Response) => {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((message) => ({ message }));
      return res.status(400).json({ errors });
    }
    const { productName } = req.body;
    const productExists = await Category.findOne({ productName });
    if (productExists) {
      return res.status(404).json({
        message: "Sản phẩm đã tồn tại",
      });
    }

    const fileImages = req.files;
    if (!fileImages || fileImages.length === 0) {
      return res.status(400).json({
        message: "Vui lòng tải lên ít nhất một hình ảnh sản phẩm",
      });
    }
    const imagePaths = fileImages.map((file) => file.path);
    // const propertiesWithImages = imagePaths.map(imagePath => ({ imageUrl: imagePath }));
    // Thêm sản phẩm vào database
    const updatedProperties = req.body.properties.map((property, index) => ({
      ...property,
      imageUrl: imagePaths[index],
    }));
    const product = await Product.create({
      ...req.body,
      properties: updatedProperties,
    });

    await Category.findOneAndUpdate(product.categoryId, {
      $addToSet: {
        products: product._id,
      },
    });
    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Thêm sản phẩm không thành công",
      error: error.message,
    });
  }
};
export const updateProduct = async (req: any, res: Response) => {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        messages: error.details.map((message) => ({ message })),
      });
    }
    const productId = req.params.id;

    // Tìm sản phẩm theo id và cập nhật dữ liệu mới

    const product = await Product.findById(productId);

    const fileImages = req.files;

    if (fileImages.length !== 0) {
      const imagePaths = fileImages.map((file) => file.path);
      const updatedProperties = req.body.properties.map((property, index) => ({
        ...property,
        imageUrl: imagePaths[index],
      }));
      const oldImagePath = product.properties?.map((property) => {
        return property.imageUrl;
      });
      if (oldImagePath.includes(undefined)) {
      } else {
        const publicId = oldImagePath[0]
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0]; // Lấy public_id từ đường dẫn

        await cloudinary.uploader.destroy(publicId);
      }

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId },
        {
          ...req.body,
          properties: updatedProperties,
        },

        { new: true }
      );
      if (!updatedProduct) {
        return res.sendStatus(404);
      }

      // Xóa sản phẩm cũ khỏi danh sách products của category cũ
      const oldCategoryId = updatedProduct.categoryId;
      await Category.findByIdAndUpdate(oldCategoryId, {
        $pull: { products: productId },
      });

      // Thêm sản phẩm mới vào danh sách products của category mới
      const newCategoryId = req.body.categoryId;
      if (newCategoryId) {
        // Thêm sản phẩm mới vào danh sách products của category mới
        await Category.findByIdAndUpdate(newCategoryId, {
          $addToSet: { products: productId },
        });
      }
      return res.status(200).json({
        message: "Cập nhật sản phẩm thành công",
        data: updatedProduct,
      });
    } else {
      console.log(req.body);
      // const {properties} = req.body;
      // if(properties){

      // }
      const updatedProperties = req.body.properties.map((property, index) => ({
        ...property,
        imageUrl: product.properties[0].imageUrl,
      }));
      const updatedProduct = await Product.findByIdAndUpdate(
        { _id: productId },
        {
          ...req.body,
          properties: updatedProperties,
        },
        { new: true }
      );
      const oldCategoryId = updatedProduct.categoryId;
      await Category.findByIdAndUpdate(oldCategoryId, {
        $pull: { products: productId },
      });

      // Thêm sản phẩm mới vào danh sách products của category mới
      const newCategoryId = req.body.categoryId;
      if (newCategoryId) {
        // Thêm sản phẩm mới vào danh sách products của category mới
        await Category.findByIdAndUpdate(newCategoryId, {
          $addToSet: { products: productId },
        });
      }
      return res.status(200).json({
        message: "Cập nhật thành công 1",
        data: updatedProduct,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Cập nhật sản phẩm không thành công",
      error: error.message,
    });
  }
};
export const removeForce = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await (Product as any).findWithDeleted({ _id: id });

    // Duyệt qua mảng property và xóa từng ảnh từ Cloudinary
    if (product[0]?.properties && product[0]?.properties.length > 0) {
      for (const property of product[0]?.properties) {
        if (property.imageUrl) {
          const publicId = property.imageUrl
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0]; // Lấy public_id từ URL
          console.log(publicId);
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    const removeProduct = await Product.deleteOne({ _id: id });
    // Xóa sản phẩm cũ khỏi danh sách products của category cũ
    await Category.findOneAndUpdate(product[0].categoryId, {
      $pull: { products: product[0]._id },
    });

    return res.status(200).json({
      message: "Xóa sản phẩm thành công",
      data: removeProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Xóa sản phẩm thất bại",
      error: error.message,
    });
  }
};
export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (product) {
      await (product as any).delete();
    }
    return res.status(200).json({
      message: "Xoá sản phẩm thành công chuyển sang thùng rác",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
export const restoreProduct = async (req, res) => {
  try {
    const restoredProduct = await (Product as any).restore(
      { _id: req.params.id },
      { new: true }
    );
    if (!restoredProduct) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại hoặc đã được khôi phục trước đó.",
      });
    }

    return res.status(200).json({
      message: "Khôi phục sản phẩm thành công.",
      data: restoredProduct,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getAllDelete = async (req, res) => {
  const query = req.query;
  const options = {
    page: checkInteger(+query?.page) ? +query.page - 1 : 0,
    limit: checkInteger(+query?.limit) ? +query.limit : 10,
    sort: query.sort || "createdAt",
    order: query.order || "desc",
  };
  try {
    // const totalProducts = await (Product as any).countDocuments({ deleted: true });
    const totalProducts = await (Product as any).findWithDeleted({
      deleted: true,
    });
    // Kiểm tra nếu trang hiện tại vượt quá tổng số trang, đặt lại trang cuối cùng
    const totalPages = Math.ceil(totalProducts.length / options.limit);
    const product = await (Product as any)
      .findWithDeleted({ deleted: true })
      .sort({
        [options.sort as string]: options.order as string,
      })
      .skip(options.page * options.limit)
      .limit(options.limit as number);
    const result = dataQueryPaginate(
      totalProducts,
      product,
      +options.limit,
      +options.page,
      totalPages
    );

    return res.status(200).json({
      message: "Lấy tất cả sản phẩm trong thùng rác",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

// Start filter Product
export const FilterProductByPrice = async (req, res) => {
  const {
    minPrice,
    maxPrice,
    _page = 1,
    _limit = _page == 0 ? 10000000 : 8,
    _sort = "createdAt",
    _order = "asc",
  } = req.query;
  const options: any = {
    page: _page,
    limit: _limit,
    sort: { [_sort as string]: _order === "desc" ? -1 : 1 },
  };

  try {
    if (minPrice && maxPrice) {
      let products = await Product.paginate(
        {
          price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
        },
        options
      );
      if (products.length === 0) {
        return res.status(404).json({
          message: "Không có sản phẩm bạn muốn tìm",
        });
      }

      return res.status(200).json({
        message: "Lấy sản phẩm thành công",
        data: products.docs,
        pagination: {
          currentPage: products.page,
          totalPages: products.totalPages,
          totalItem: products.totalDocs,
          sizePerPage: products.limit,
        },
      });
    }
    if (minPrice) {
      let products = await Product.paginate(
        {
          price: { $gte: Number(minPrice) },
        },
        options
      );
      if (products.length === 0) {
        return res.status(404).json({
          message: "Không có sản phẩm bạn muốn tìm",
        });
      }

      return res.status(200).json({
        message: "Lấy sản phẩm thành công",
        data: products.docs,
        pagination: {
          currentPage: products.page,
          totalPages: products.totalPages,
          totalItem: products.totalDocs,
          sizePerPage: products.limit,
        },
      });
    }
    if (maxPrice) {
      let products = await Product.paginate(
        {
          price: { $lte: Number(maxPrice) },
        },
        options
      );
      if (products.length === 0) {
        return res.status(404).json({
          message: "Không có sản phẩm bạn muốn tìm",
        });
      }
      return res.status(200).json({
        message: "Lấy sản phẩm thành công",
        data: products.docs,
        pagination: {
          currentPage: products.page,
          totalPages: products.totalPages,
          totalItem: products.totalDocs,
          sizePerPage: products.limit,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Lọc sản phẩm theo size
export const FilterProductBySize = async (req, res) => {
  const {
    _page = 1,
    _limit = _page == 0 ? 10000000 : 8,
    _sort = "createdAt",
    _order = "asc",
    _size,
  } = req.query;
  const options: any = {
    page: _page,
    limit: _limit,
    sort: { [_sort as string]: _order === "desc" ? -1 : 1 },
  };
  try {
    const filteredProducts = await Product.paginate(
      {
        properties: {
          $elemMatch: {
            variants: {
              $elemMatch: { size: _size },
            },
          },
        },
      },
      options
    );
    if (filteredProducts.length === 0) {
      return res.status(404).json({
        message: "Không có sản phẩm nào bạn muốn tìm",
      });
    }
    return res.status(200).json({
      message: "Lọc sản phẩm thành công",
      data: filteredProducts.docs,
      pagination: {
        currentPage: filteredProducts.page,
        totalPages: filteredProducts.totalPages,
        totalItem: filteredProducts.totalDocs,
        sizePerPage: filteredProducts.limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Lấy sản phẩm theo categoryId
export const getProductByCategoryId = async (req: any, res: Response) => {
  const {
    _page = 1,
    _limit = _page == 0 ? 1000000000 : 8,
    _sort = "createdAt",
    _order = "asc",
  } = req.query;
  const options: any = {
    page: _page,
    limit: _limit,
    sort: { [_sort as string]: _order === "desc" ? -1 : 1 },
  };
  try {
    const { categoryId } = req.params;
    const product = await Product.paginate({ categoryId: categoryId }, options);
    if (!product) throw new Error("Product not found");
    return res.status(200).json({
      data: product.docs,
      pagination: {
        currentPage: product.page,
        totalPages: product.totalPages,
        totalItem: product.totalDocs,
        sizePerPage: product.limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const queryProductByCateId = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    const options = {
      page: query.page ? +query.page - 1 : 0,
      limit: query.limit ? +query.limit : 8,
      sort: query.sort ? query.sort : "createdAt",
      order: query.order ? query.order : "asc",
    };

    const categoryId = query.categoryId;

    const products = await Product.find(
      categoryId ? { categoryId: categoryId } : {}
    )
      .sort({ [options.sort as string]: options.order as SortOrder })
      .skip(+options.limit * +options.page)
      .limit(options.limit as number);

    if (!products) {
      return res.status(200).json({
        message: "Không có sản phẩm nào",
      });
    }

    const productLength = await Product.find(categoryId ? { categoryId: categoryId } : {}).count()

    const results = dataQuery(products, +options.limit, +options.page, productLength);

    return res.status(200).json({
      message: "Lấy sản phẩm thành công",
      result: results,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const FilterProductByDiscount = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const discountedProducts = await Product.find({
      categoryId: categoryId,
      discount: { $gt: 0 },
    }).sort({ discount: -1 });
    if (!discountedProducts) throw new Error("Product not found");
    return res.status(200).json({ discountedProducts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getInventoryOfProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { color, size } = req.query;

    const product = await Product.findOne({
      _id: id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    const indexOfColor = product.properties.findIndex(
      (item) => item.color === color
    );
    const indexOfSize = product.properties[indexOfColor].variants.findIndex(
      (item) => item.size === size
    );
    const inventory =
      product.properties[indexOfColor].variants[indexOfSize].quantity;

    return res.status(200).json({
      result: inventory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const ImportProductByExcel = async (req: any, res: Response) => {
  try {
    // Đọc dữ liệu từ tệp Excel và thêm vào MongoDB
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const productData = {};

    workbook.eachSheet((worksheet, sheetId) => {
      worksheet
        .getRow(1)
        .eachCell({ includeEmpty: true }, (cell) => (cell.value = cell.text));
      worksheet.eachRow(
        { min: 2, max: worksheet.actualRowCount },
        (row, rowNumber) => {
          const productId = row.getCell("A").value;
          if (!productData[productId]) {
            productData[productId] = {
              productName: row.getCell("A").value,
              price: row.getCell("B").value,
              description: row.getCell("C").value,
              categoryId: row.getCell("D").value,
              properties: [],
            };
          }
          const imageUrl = row.getCell("E").text;
          const color = row.getCell("F").value;
          const size = row.getCell("G").value;
          const quantity = row.getCell("H").value;

          const propertyIndex = productData[productId].properties.findIndex(
            (p) => p.color === color
          );

          if (propertyIndex === -1) {
            // Màu chưa tồn tại, thêm mới
            productData[productId].properties.push({
              color: color,
              imageUrl: imageUrl,
              variants: [{ size, quantity }],
            });
          } else {
            // Màu đã tồn tại, thêm kích thước và số lượng mới
            productData[productId].properties[propertyIndex].variants.push({
              size,
              quantity,
            });
          }
        }
      );
    });

    // Chuyển đổi dữ liệu từ object sang array
    const productsArray = Object.values(productData);

    // Thêm dữ liệu vào MongoDB
    await product.insertMany(productsArray);

    res.status(200).json({ message: "Import completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
