import express from "express";

import { forgotPassword, login, register, resetPassword } from "../controllers/authController.js";

const router = express.Router();

/* ---------- Register ---------- */
router.post("/register",register);

/* ---------- Login ---------- */
router.post("/login", login);


router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;
