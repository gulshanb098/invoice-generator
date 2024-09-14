import express from "express";
import { login, registration } from "../controllers/auth-controller";
import {
    loginSchema,
    registrationSchema,
    validate,
} from "../middlewares/validate";
const router = express.Router();

router.post(
  "/registration",
  validate(registrationSchema, "body"),
  registration
);
router.post("/login", validate(loginSchema, "body"), login);

export default router;
