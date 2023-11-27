import { Response, Request, NextFunction } from "express";
import HTTP_STATUS from "../constants/httpStatus";
import { AddToCartReqBody } from "../model/requests/cart.requests";
import { ParamsDictionary } from "express-serve-static-core";
import Cart from "../model/cart";

/**
 * @Description: get all product in cart
 * @header: {user_id}
 */
export const getAllProductInCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.params;
  const cart = await Cart.find({ user_id: user_id });
  // console.log(cart);
  
  const products = cart[0].products;

  return res.status(HTTP_STATUS.OK).json({
    result: products,
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
  // console.log(req.body);
  
  const { _id } = product;

  // kiem tra san pham co ton tai trong products khong

  const productExistInCart = await Cart.find({
    user_id: user_id,
    "products._id": _id,
  });

  
  if (!productExistInCart || productExistInCart.length === 0) {
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
        "products._id": _id,
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


