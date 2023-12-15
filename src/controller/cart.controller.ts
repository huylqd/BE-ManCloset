import { Response, Request, NextFunction } from "express";
import HTTP_STATUS from "../constants/httpStatus";
import { AddToCartReqBody } from "../model/requests/cart.requests";
import { ParamsDictionary } from "express-serve-static-core";
import Cart from "../model/cart";
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
  const { _id } = product;

  // const objUserId = new ObjectId(user_id)
  // console.log(user_id)
  // kiem tra san pham co ton tai trong products khong

  const userCart = await Cart.findOne({
    user_id: user_id,
  });

  if(!userCart){
    return res.status(404).json({
      message: "Khong tim thay gio hang"
    })
  }

  const productsInCart = userCart.products

  if (!productsInCart || productsInCart.length === 0) {
    // neu san pham chua ton tai, them san pham vao products []
    const productAddToCart = {
      ...product,
      addedAt: new Date(),
      updatedAt: new Date(),
    };

    await Cart.updateOne(
      { user_id: user_id },
      {
        $push: {
          products: productAddToCart,
        },
      }
    );
  } else {
    // neu san pham da ton tai, cap nhat san pham
    const newQuantity = product.quantity;
    const newUpdatedAt = new Date();

    await Cart.updateOne(
      {
        user_id: user_id,
        products: {
          $elemMatch: {
            _id: _id
          }
        }
      },
      {
        $inc: {
          "products.$.quantity": newQuantity,
        },
        $set: {
          "products.$.updatedAt": newUpdatedAt,
        },
      }
    );
  }

  return res.status(HTTP_STATUS.OK).json({
    message: "Thêm sản phẩm thành công",
  });
};

export const deleteProductInCart = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const products = req.body;

    const cart = await Cart.find({ user_id: id });

    if (!cart) {
      return res.status(404).json({
        message: "Giỏ hàng không tồn tại",
      });
    }

    const productIds = products.map((item) => item._id);

    await Cart.updateMany(
      { user_id: id },
      { $pull: { products: { _id: { $in: productIds } } } }
    );

    const updateCart = await Cart.findOne({
      user_id: id,
    });
    return res.status(200).json({
      message: "Xoá sản phẩm thành công",
      data: updateCart.products,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
