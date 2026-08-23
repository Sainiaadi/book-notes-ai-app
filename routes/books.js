import express from "express";
import { renderHome, renderAddBook, addBook } from "../controllers/bookController.js";

const router = express.Router();

// Simple auth middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect("/auth/login");
}

// Your EXACT original routes
router.get("/", requireAuth, renderHome);
router.get("/addbook", requireAuth, renderAddBook);
router.post("/add", requireAuth, addBook);

export default router;
