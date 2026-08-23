import db from "../config/database.js";
import bcrypt from "bcryptjs";

export async function renderLogin(req, res) {
    if (req.session.userId) {
        return res.redirect("/");
    }
    res.render("auth/login.ejs", { error: null });
}

export async function renderRegister(req, res) {
    if (req.session.userId) {
        return res.redirect("/");
    }
    res.render("auth/register.ejs", { error: null });
}

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        
        const checkQuery = "SELECT * FROM users WHERE email = $1 OR username = $2";
        const existingUser = await db.query(checkQuery, [email, username]);
        
        if (existingUser.rows.length > 0) {
            return res.render("auth/register.ejs", { 
                error: "User with this email or username already exists" 
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email";
        const result = await db.query(query, [username, email, hashedPassword]);
        
        req.session.userId = result.rows[0].id;
        req.session.user = result.rows[0];
        
        res.redirect("/");
    } catch (error) {
        console.error("Registration error:", error);
        res.render("auth/register.ejs", { error: "Registration failed" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await db.query(query, [email]);
        
        if (result.rows.length === 0) {
            return res.render("auth/login.ejs", { error: "Invalid email or password" });
        }
        
        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.render("auth/login.ejs", { error: "Invalid email or password" });
        }
        
        req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        
        res.redirect("/");
    } catch (error) {
        console.error("Login error:", error);
        res.render("auth/login.ejs", { error: "Login failed" });
    }
}

export function logout(req, res) {
    req.session.destroy((err) => {
        if (err) console.error("Logout error:", err);
        res.redirect("/auth/login");
    });
}
