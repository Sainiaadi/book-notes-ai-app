-- Migration: Create chat_history table for conversational AI
-- This table stores conversation messages between users and the AI assistant for each book

CREATE TABLE IF NOT EXISTS chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup of conversation history per user and book
CREATE INDEX IF NOT EXISTS idx_chat_history_user_book ON chat_history(user_id, book_id, created_at);
