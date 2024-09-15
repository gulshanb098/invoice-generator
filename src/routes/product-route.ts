import express from "express";
import { addProducts } from "../controllers/product-controller";
import { authMiddleware } from "../middlewares/auth-middleware";
import { addProductsSchema, validate } from "../middlewares/validate";
const router = express.Router();

router.post(
  "/addProducts",
  authMiddleware,
  validate(addProductsSchema, "body"),
  addProducts
);

export default router;
