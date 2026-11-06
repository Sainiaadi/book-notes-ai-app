# 📚 Multi-User Book Notes Management System with AI Integration

A full-stack web application for managing your personal book collection and notes with AI-powered insights, built with Node.js, Express, PostgreSQL, and EJS using modular MVC architecture.

## 🌟 Features

- **Multi-User Authentication**: Secure bcrypt-based authentication with session-based login and persistent user-specific data storage
- **Book Management**: Add books with ISBN, title, author, rating, and reading dates
- **Note Taking**: Create, edit, and delete detailed notes for each book
- **OpenLibrary Integration**: Automatically fetch book metadata including subjects, publisher info, cover images, and page counts
- **AI-Powered Insights (Gemini)**:
  - **Conversational Book Q&A**: Context-aware chat interface that remembers conversation history per book
  - **Genre Analysis**: AI analyzes your reading history to identify your favorite genres
  - **Book Recommendations**: Personalized recommendations based on your reading preferences
- **User Profile**: View reading statistics, AI-generated genre analysis, and personalized recommendations
- **Responsive Design**: Clean, user-friendly interface with night-light mode, built with EJS templating and Bootstrap
- **Database Storage**: Persistent storage using PostgreSQL with user-scoped data

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js (modular MVC architecture)
- **Database**: PostgreSQL
- **Frontend**: EJS templating engine, HTML, CSS, JavaScript, Bootstrap 5
- **Authentication**: bcryptjs for password hashing, express-session for session management
- **External APIs**: OpenLibrary API for book metadata, Google Gemini AI for intelligent insights
- **AI Integration**: @google/genai SDK (Gemini 2.5 Flash for Q&A, Gemini 2.5 Flash-Lite for genre analysis and recommendations)
- **Other**: Axios for HTTP requests, dotenv for environment management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- npm (comes with Node.js)
- Google Gemini API key (get one at [Google AI Studio](https://aistudio.google.com/))

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Sainiaadi/book-notes-ai-app.git
cd book-notes-ai-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

Create a PostgreSQL database and tables:

```sql
-- Create database
CREATE DATABASE book_notes;

-- Connect to the database
\c book_notes;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Books table
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_isbn VARCHAR(255),
    book_notes_date DATE,
    book_rating INTEGER CHECK (book_rating >= 1 AND book_rating <= 5),
    book_title VARCHAR(255),
    author VARCHAR(255),
    subjects VARCHAR(255),
    publisher VARCHAR(255)
);

-- Individual notes table
CREATE TABLE booknotes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
    book_notes TEXT
);

-- Chat history table for conversational AI
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast chat history lookup
CREATE INDEX idx_chat_history_user_book ON chat_history(user_id, book_id, created_at);
```

Alternatively, run the included migration script after creating the database:

```bash
npm run migrate
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
PG_USER=your_postgres_username
PG_HOST=localhost
PG_DATABASE=book_notes
PG_PASSWORD=your_postgres_password
PG_PORT=5432
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Run the Application

```bash
# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

The application will be available at `http://localhost:3000`

## 📖 Usage

### Authentication
1. Navigate to `/auth/register` to create a new account
2. Log in at `/auth/login` with your email and password
3. Each user's books and notes are private and scoped to their account

### Adding Books
1. Navigate to `/addbook`
2. Fill in the book details:
   - **ISBN**: Book's ISBN number
   - **Title**: Book title
   - **Author**: Author name
   - **Rating**: Your rating (1-5 stars)
   - **Date Started**: When you started reading

### Managing Notes
1. **View Notes**: Click on any book to view its notes
2. **Add Notes**: Use the "Add Note" button on a book's page
3. **Edit Notes**: Click the edit icon next to any note
4. **Delete Notes**: Click the delete icon next to any note

### AI Chat (Conversational Q&A)
1. Open any book's notes page (`/notes/view/:id`)
2. Use the AI Chat section at the bottom to ask questions about the book
3. The AI remembers your conversation history per book — ask follow-up questions naturally
4. Previous conversations are loaded automatically when you revisit a book

### Book Information
The app automatically fetches additional information from OpenLibrary API including:
- Book subjects/genres
- Publisher information
- Page count
- Cover images
- Direct links to OpenLibrary pages

### User Profile
Navigate to `/profile` to view:
- Reading statistics (total books, total notes, average rating)
- AI-analyzed favorite genres
- Personalized book recommendations

## 📁 Project Structure

```
book-notes-ai-app/
├── app.js                    # Main application entry point
├── package.json              # Project dependencies and scripts
├── .env                      # Environment variables (create this)
├── config/
│   └── database.js          # PostgreSQL connection configuration
├── controllers/              # MVC controllers
│   ├── authController.js     # User registration, login, logout
│   ├── bookController.js     # Book CRUD and OpenLibrary integration
│   ├── noteController.js     # Note CRUD operations
│   ├── profileController.js  # User profile with AI insights
│   └── qaController.js       # Conversational AI Q&A handler
├── routes/                   # Express route definitions
│   ├── auth.js              # Authentication routes
│   ├── books.js             # Book routes
│   ├── notes.js             # Note routes
│   ├── profile.js           # Profile route
│   └── qa.js                # AI Q&A and chat history routes
├── services/
│   └── geminiService.js      # Gemini AI integration (genre analysis, recommendations, Q&A)
├── migrations/
│   ├── 001_create_chat_history.sql  # Chat history table migration
│   └── runMigrations.js             # Migration runner script
├── public/                   # Static files (CSS, images)
│   ├── homestyle.css
│   ├── viewstyle.css
│   └── profilestyle.css
└── views/                    # EJS templates
    ├── home.ejs             # Main page showing all books
    ├── add.ejs              # Add new book form
    ├── view.ejs             # View notes + AI chat for a book
    ├── addnote.ejs          # Add new note form
    ├── notesedit.ejs        # Edit existing note
    ├── profile.ejs          # User profile with AI insights
    └── auth/
        ├── login.ejs        # Login page
        └── register.ejs     # Registration page
```

## 🔧 API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Login user
- `GET /auth/register` - Registration page
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Logout user

### Books
- `GET /` - Home page displaying all books (requires auth)
- `GET /addbook` - Form to add a new book (requires auth)
- `POST /add` - Submit new book data (requires auth)

### Notes
- `GET /notes/view/:id` - View notes for a specific book (requires auth)
- `GET /notes/add/:id` - Form to add a note to a book (requires auth)
- `POST /addnote/:id` - Submit new note data (requires auth)
- `GET /edit/:id1/:id2` - Edit a specific note (requires auth)
- `PATCH /edit/:id1/:id2` - Update a specific note (requires auth)
- `GET /delete/:id1/:id2` - Delete a specific note (requires auth)

### Profile
- `GET /profile` - User profile with AI insights (requires auth)

### AI Q&A
- `POST /qa/book/:id` - Ask AI a question about a book (requires auth)
- `GET /qa/history/:id` - Retrieve chat history for a book (requires auth)

## 👨‍💻 Author
**Aaditya** - *Initial work*

## 🙏 Acknowledgments

- [OpenLibrary API](https://openlibrary.org/developers/api) for book metadata
- [Google Gemini AI](https://ai.google.dev/) for intelligent insights and recommendations
- [Express.js](https://expressjs.com/) for the web framework
- [PostgreSQL](https://www.postgresql.org/) for database management
