import express from "express";
import { 
    viewNotes, 
    renderAddNote, 
    addNote, 
    deleteNote, 
    renderEditNote, 
    updateNote 
} from "../controllers/noteController.js";

const router = express.Router();

// Simple auth middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect("/auth/login");
}

// Your EXACT original routes
router.get("/notes/view/:id", requireAuth, viewNotes);
router.get("/notes/add/:id", requireAuth, renderAddNote);
router.post("/addnote/:id", requireAuth, addNote);
router.get("/delete/:id1/:id2", requireAuth, deleteNote);
router.get("/edit/:id1/:id2", requireAuth, renderEditNote);
router.patch("/edit/:id1/:id2", requireAuth, updateNote);

export default router;
