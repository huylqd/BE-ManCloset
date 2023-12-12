import express , { Router } from "express";

import { create_payment_url, vnPay_return, vnPay_ipn } from "../controller/VnPayController";
import { checkPermission } from "../middleware/checkPermission";

const router: Router = express.Router()

router.post('/create_payment_url',(req, res, next) => { checkPermission(req, res, next, 'member') }, create_payment_url)
router.get('/vnpay_return', vnPay_return)
router.get('/vnpay_ipn', vnPay_ipn)
export default router;