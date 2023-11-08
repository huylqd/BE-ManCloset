export interface AddToCartReqBody {
  user_id: string,
  product: {
    _id: string,
    name: string,
    price: number,
    quantity: number,
    color: string,
    size: string,
    imageUrl: string
  }
}
