# 📚 Book Notes Management System

A web application for managing your personal book collection and notes, built with Node.js, Express, and PostgreSQL.

## 🌟 Features

- **Book Management**: Add books with ISBN, title, author, rating, and reading dates
- **Note Taking**: Create, edit, and delete detailed notes for each book
- **OpenLibrary Integration**: Automatically fetch book metadata including subjects, publisher info, and cover images
- **Responsive Design**: Clean, user-friendly interface built with EJS templating
- **Database Storage**: Persistent storage using PostgreSQL

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Frontend**: EJS templating engine, HTML, CSS, JavaScript
- **External APIs**: OpenLibrary API for book metadata
- **Other**: Axios for HTTP requests, dotenv for environment management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- npm (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone 
cd book-notes
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

-- Connect to the database and create tables
\c book_notes;

-- Books table
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    book_isbn VARCHAR(255),
    book_notes_date DATE,
    book_rating INTEGER CHECK (book_rating >= 1 AND book_rating <= 5),
    book_title VARCHAR(255),
    author VARCHAR(255)
);

-- Individual notes table
CREATE TABLE booknotes (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
    book_notes TEXT
);
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
PG_USER=your_postgres_username
PG_HOST=localhost
PG_DATABASE=book_notes
PG_PASSWORD=your_postgres_password
PG_PORT=5432
```

### 5. Run the Application

```bash
# Start the server
node index.js

# Or if you have nodemon installed
nodemon index.js
```

The application will be available at `http://localhost:3000`

## 📖 Usage

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

### Book Information
The app automatically fetches additional information from OpenLibrary API including:
- Book subjects/genres
- Publisher information
- Direct links to OpenLibrary pages

## 📁 Project Structure

```
book-notes/
├── index.js          # Main application file
├── package.json      # Project dependencies and scripts
├── .env             # Environment variables (create this)
├── public/          # Static files (CSS, JS, images)
├── views/           # EJS templates
│   ├── home.ejs     # Main page showing all books
│   ├── add.ejs      # Add new book form
│   ├── view.ejs     # View notes for a book
│   ├── addnote.ejs  # Add new note form
│   └── notesedit.ejs # Edit existing note
└── node_modules/    # Dependencies (auto-generated)
```

## 🔧 API Endpoints

- `GET /` - Home page displaying all books
- `GET /addbook` - Form to add a new book
- `POST /add` - Submit new book data
- `GET /notes/view/:id` - View notes for a specific book
- `GET /notes/add/:id` - Form to add a note to a book
- `POST /addnote/:id` - Submit new note data
- `GET /edit/:id1/:id2` - Edit a specific note
- `PATCH /edit/:id1/:id2` - Update a specific note
- `GET /delete/:id1/:id2` - Delete a specific note


## 👨‍💻 Author
**Sanyam** - *Initial work*

## 🙏 Acknowledgments

- [OpenLibrary API](https://openlibrary.org/developers/api) for book metadata
- [Express.js](https://expressjs.com/) for the web framework
- [PostgreSQL](https://www.postgresql.org/) for database management

---

**Note**: This is a personal book management system designed for individual use. For production deployment, consider adding user authentication, input validation, and additional security measures.
