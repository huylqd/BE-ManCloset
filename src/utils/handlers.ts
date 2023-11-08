import { NextFunction, Request, RequestHandler, Response } from 'express'

/**
 * wrapRequestHandler
 * desc: dùng để thay thế cho try catch ở mỗi controller làm code tối ưu hơn,
 * và phòng trường hợp controller là một async func thì wrapRequestHandler có thể
 * tự động next khi bị lỗi do async không thể tự động next khi gặp lỗi
 */
export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
