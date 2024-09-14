import express from "express";
import { registration } from "../controllers/auth-controller";
const router = express.Router();

router.post("/registration", registration);

export default router;
