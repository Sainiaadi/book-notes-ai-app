import express from "express";
import { renderLogin, renderRegister, register, login, logout } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", renderLogin);
router.post("/login", login);
router.get("/register", renderRegister);
router.post("/register", register);
router.post("/logout", logout);
router.get("/logout", logout);

export default router;
