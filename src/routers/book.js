import express from "express";
import { create, getAll, getOne, remove, update } from "../controller/book";
import { checkPermission } from "../middelware/checkPermission";

const router = express.Router()

router.get("/books", getAll)
router.get("/books/:id", getOne)
router.post("/books",checkPermission, create)
router.put("/books/:id", update)
router.delete("/books/:id", remove)


export default router