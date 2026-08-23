import express from "express";
import { renderProfile } from "../controllers/profileController.js";

const router = express.Router();

// Simple auth middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect("/auth/login");
}

router.get("/", requireAuth, renderProfile);

export default router;
