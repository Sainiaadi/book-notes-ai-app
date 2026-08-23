import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import env from "dotenv";

// Import routes
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import noteRoutes from "./routes/notes.js";
import profileRoutes from "./routes/profile.js";
import qaRoutes from "./routes/qa.js";  // ← THIS WAS MISSING!

const app = express();
const port = 3000;

env.config();

// Session setup
app.use(session({
    secret: 'my-book-notes-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// Make user available in views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/", bookRoutes);
app.use("/", noteRoutes);
app.use("/profile", profileRoutes);
app.use("/qa", qaRoutes);  // ← ADD THIS LINE!

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
