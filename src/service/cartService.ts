import cart from "../model/cart";

export const DeleteProductInCart = async (user_id, items) => {
  try {
    await cart
      .updateOne(
        { user_id: user_id },
        { $pull: { products: { _id: { $in: items } } } }
      )
      .then((result) => {
        return {
          status: 0,
          message: result,
        };
      })
      .catch((err) => {
        return {
          status: -1,
          message: err,
        };
      });
  } catch (error) {
    return {
      status: -1,
      message: "something went wrong",
    };
  }
};
