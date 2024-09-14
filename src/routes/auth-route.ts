import express from "express";
import { login, registration } from "../controllers/auth-controller";
const router = express.Router();

router.post("/registration", registration);
router.post("/login", login);

export default router;
