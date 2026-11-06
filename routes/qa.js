import express from "express";
import { handleBookQA, getChatHistory } from "../controllers/qaController.js";

const router = express.Router();

// Simple auth middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect("/auth/login");
}

router.post("/book/:id", requireAuth, handleBookQA);
router.get("/history/:id", requireAuth, getChatHistory);

export default router;
