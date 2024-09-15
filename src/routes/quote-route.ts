import express from "express";
import { getAllInvoicePDFs } from "../controllers/quote-controller";
import { authMiddleware } from "../middlewares/auth-middleware";
const router = express.Router();

router.get("/allInvoices", authMiddleware, getAllInvoicePDFs);

export default router;