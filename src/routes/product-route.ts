import express from "express";
import {
  addProducts,
  getAllInvoicePDFs,
} from "../controllers/product-controller";
import { authMiddleware } from "../middlewares/auth-middleware";
import { addProductsSchema, validate } from "../middlewares/validate";
const router = express.Router();

router.post(
  "/addProducts",
  authMiddleware,
  validate(addProductsSchema, "body"),
  addProducts
);
router.get("/allInvoices", authMiddleware, getAllInvoicePDFs);

export default router;
