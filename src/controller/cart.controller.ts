import { Response, Request, NextFunction } from "express";
import HTTP_STATUS from "../constants/httpStatus";
import { AddToCartReqBody } from "../model/requests/cart.requests";
import { ParamsDictionary } from "express-serve-static-core";
import Cart from "../model/cart";
import Product from "../model/product";
import { ObjectId } from "mongodb";
/**
 * @Description: get all product in cart
 * @header: {user_id}
 */
export const getAllProductInCart = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.user;
  const cart = await Cart.findOne({ user_id: _id });

  if (!cart) {
    return res.status(400).json({
      message: "Giỏ hàng bị lỗi",
    });
  }

  const products = cart.products;

  return res.status(HTTP_STATUS.OK).json({
    result: products,
    message: "Lấy sản phẩm trong giỏ hàng thành công",
  });
};

/**
 * @Description: Add product to cart
 * @body: {_id, name, price, quantity, color, size, imageUrl}
 */
export const addProductToCard = async (
  req: Request<ParamsDictionary, any, AddToCartReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { product, user_id } = req.body;

  const userCart = await Cart.findOne({
    user_id: user_id,
  });

  if (!userCart) {
    return res.status(404).json({
      message: "Khong tim thay gio hang",
    });
  }

  const isProductExistInCart = userCart.products.find((item) => {
    if (
      item._id.toString() === product._id.toString() &&
      item.color === product.color &&
      item.size === product.size
    ) {
      return true;
    }
    return false;
  });

  const productAdding = await Product.findOne({
    _id: product._id,
  });

  if (!product) {
    return res.status(404).json({
      message: "Không tìm thấy sản phẩm",
    });
  }

  const indexOfColor = productAdding.properties.findIndex(
    (item) => item.color === product.color
  );
  const indexOfSize = productAdding.properties[indexOfColor].variants.findIndex(
    (item) => item.size === product.size
  );
  const inventory =
    productAdding.properties[indexOfColor].variants[indexOfSize].quantity;

  if (!isProductExistInCart) {
    await Cart.updateOne(
      {
        user_id: user_id,
      },
      {
        $push: {
          products: product,
        },
      }
    );
  } else {
    if (isProductExistInCart.quantity === inventory) {
      return res.status(400).json({
        message:
          "Số lượng sản phẩm này trong giỏ hàng của bạn đã đạt mức tối đa!",
      });
    }
    if (product.quantity + isProductExistInCart.quantity > inventory) {
      return res.status(400).json({
        message: `Bạn chỉ thêm được ${
          inventory - isProductExistInCart.quantity
        } sản phẩm vào giỏ hàng!`,
      });
    }

    await Cart.updateOne(
      {
        user_id: user_id,
        products: {
          $elemMatch: {
            _id: product._id,
          },
        },
      },
      {
        $inc: {
          "products.$.quantity": product.quantity,
        },
        $set: {
          "products.$.updatedAt": new Date(),
        },
      }
    );
  }

  const cartUpdated = await Cart.findOne({
    user_id: user_id,
  });

  return res.status(HTTP_STATUS.OK).json({
    message: "Thêm sản phẩm thành công",
    result: cartUpdated.products,
  });
};

type TProductInCart = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  imageUrl: string;
  addedAt?: Date;
  updatedAt?: Date;
}
export const deleteProductInCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const products:TProductInCart[] = req.body;

    const cart = await Cart.find({ user_id: id });

    if (!cart) {
      return res.status(404).json({
        message: "Giỏ hàng không tồn tại",
      });
    }

    products.forEach(async (product) => {
      await Cart.updateOne(
        {
          user_id: id,
        },
        {
          $pull: {
            products: {
              _id: product._id,
              color: product.color,
              size: product.size,
            },
          },
        },
        { new: true }
      );
    });

    const updateCart = await Cart.findOne({ user_id: id });

    return res.status(200).json({
      message: "Xoá sản phẩm thành công",
      result: updateCart.products,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const updateProductInCart = async (req: Request, res: Response) => {
  try {
    const { user_id, id } = req.params;
    const { color, size } = req.query;
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      user_id: user_id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }

    if (quantity) {
      await Cart.updateOne(
        {
          user_id: user_id,
          products: {
            $elemMatch: {
              _id: id,
              color: color,
              size: size,
            },
          },
        },
        {
          $set: {
            "products.$.quantity": quantity,
            "products.$.updatedAt": new Date(),
          },
        },
        { new: true }
      );
    }

    const cartUpdated = await Cart.findOne({ user_id: user_id });
    const productUpdated = cartUpdated.products.find((item) => {
      if (
        item._id.toString() === id &&
        item.color === color &&
        item.size === size
      ) {
        return true;
      }
      return false;
    });

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      result: productUpdated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
