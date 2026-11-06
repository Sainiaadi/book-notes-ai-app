import db from "../config/database.js";
import { answerBookQuestion } from "../services/geminiService.js";

export async function handleBookQA(req, res) {
    try {
        const bookId = parseInt(req.params.id, 10);
        const userId = req.session.userId;
        const { question } = req.body;

        if (isNaN(bookId)) {
            return res.status(400).json({ error: "Invalid book ID" });
        }

        if (!question || question.trim().length === 0) {
            return res.status(400).json({ error: "Question is required" });
        }

        // Get book information
        const bookQuery = "SELECT * FROM notes WHERE id = $1 AND user_id = $2";
        const bookResult = await db.query(bookQuery, [bookId, userId]);
        
        if (bookResult.rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        const book = bookResult.rows[0];

        // Get user's notes for this book
        const notesQuery = "SELECT book_notes FROM booknotes WHERE book_id = $1 AND user_id = $2";
        const notesResult = await db.query(notesQuery, [bookId, userId]);
        const notes = notesResult.rows.map(n => n.book_notes).join('\n\n');

        const context = {
            bookInfo: `Title: ${book.book_title}\nAuthor: ${book.author}\nISBN: ${book.book_isbn}\nRating: ${book.book_rating}/5\nSubjects: ${book.subjects || "Unknown"}\nPublisher: ${book.publisher || "Unknown"}\nDate Added: ${book.book_notes_date}`,
            notes: notes || "No personal notes available for this book.",
            title: book.book_title,
            author: book.author,
            rating: book.book_rating,
        };

        // Retrieve previous chat history for conversational context
        const historyQuery = "SELECT role, message FROM chat_history WHERE user_id = $1 AND book_id = $2 ORDER BY created_at ASC";
        const historyResult = await db.query(historyQuery, [userId, bookId]);
        const chatHistory = historyResult.rows;

        // Store the user's question in chat history
        await db.query(
            "INSERT INTO chat_history (user_id, book_id, role, message) VALUES ($1, $2, $3, $4)",
            [userId, bookId, 'user', question]
        );

        // Get AI answer with conversation context
        const answer = await answerBookQuestion(question, context, chatHistory);

        // Store the AI's answer in chat history
        await db.query(
            "INSERT INTO chat_history (user_id, book_id, role, message) VALUES ($1, $2, $3, $4)",
            [userId, bookId, 'assistant', answer]
        );
        
        res.json({ 
            success: true, 
            answer: answer,
            book: book.book_title 
        });

    } catch (error) {
        console.error("Q&A error:", error);
        res.status(500).json({ error: "Failed to process question" });
    }
}

export async function getChatHistory(req, res) {
    try {
        const bookId = parseInt(req.params.id, 10);
        const userId = req.session.userId;

        if (isNaN(bookId)) {
            return res.status(400).json({ error: "Invalid book ID" });
        }

        const query = "SELECT role, message, created_at FROM chat_history WHERE user_id = $1 AND book_id = $2 ORDER BY created_at ASC";
        const result = await db.query(query, [userId, bookId]);

        res.json({ 
            success: true, 
            history: result.rows 
        });

    } catch (error) {
        console.error("Chat history error:", error);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
}
