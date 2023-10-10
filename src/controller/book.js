import Book from "../model/book";
import { bookSchema } from "../schema/book";

export const getAll = async (req, res) => {
    const {_page =1 ,_limit=20, _oder='asc', _sort='createAt'} = req.query
    const options = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _oder == "desc" ? -1 : 1
        }
    }
    try {
        const book = await Book.paginate({}, options)
        return res.status(200).json(book)
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}
export const getOne = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        return res.status(200).json(book)
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}
export const create = async (req, res) => {
    try {
        const {error} = bookSchema.validate(req.body, {abortEarly: false})
        if(error) {
            return res.status(400).json({
                message: error.details.map(err => err.message)
            })
        }
        const book = await Book.create(req.body)
        return res.status(201).json({
            message: "Tao sach thanh cong",
            data: book
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}
export const update = async (req, res) => {
    try {
        const {error} = bookSchema.validate(req.body, {abortEarly: false})
        if(error) {
            return res.status(400).json({
                message: error.details.map(err => err.message)
            })
        }
        const book = await Book.findOneAndUpdate(req.params.id, req.body, {new: true})
        return res.status(201).json({
            message: "Updated sach thanh cong",
            data: book
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}
export const remove = async (req, res) => {
    try {
        const book = await Book.findOneAndDelete(req.params.id)
        return res.status(201).json({
            message: "Delete sach thanh cong",
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}