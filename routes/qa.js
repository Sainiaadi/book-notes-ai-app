import express from "express";
import { handleBookQA } from "../controllers/qaController.js";

const router = express.Router();

// Simple auth middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect("/auth/login");
}

router.post("/book/:id", requireAuth, handleBookQA);

export default router;
