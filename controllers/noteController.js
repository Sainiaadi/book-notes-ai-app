import db from "../config/database.js";

export async function viewNotes(req, res) {
    const bookId = parseInt(req.params.id, 10);
    if (isNaN(bookId)) {
        return res.status(400).send("Invalid book ID.");
    }

    const query = "SELECT booknotes.id, book_notes, book_title FROM notes JOIN booknotes ON notes.id = booknotes.book_id WHERE notes.id = $1 AND notes.user_id = $2;";
    try {
        const result = await db.query(query, [bookId, req.session.userId]);
        // console.log(result.rows);
        // Check if no notes were found
        if (result.rows.length === 0) {
            return res.status(404).send("No notes found for the given book ID");
            console.log("No notes yet");
        } else {
            let notes = result.rows.map((row, index) => ({
                number: index + 1,
                text: row.book_notes,
                id: row.id
            }));
            // Send the data to the view
            res.render("view.ejs", {
                book: result.rows[0], // Assuming the book title is consistent for the whole book
                title: result.rows[0].book_title,
                notes: notes, // Send the notes to the view
                bookid: bookId
            });
        }
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).send("Internal Server Error");
    }
}

export async function renderAddNote(req, res) {
    // YOUR EXACT ORIGINAL CODE - just added user_id check
    const bookId = parseInt(req.params.id, 10);
    if (isNaN(bookId)) {
        return res.status(400).send("Invalid book ID.");
    }

    const query = "SELECT book_title FROM notes WHERE id = $1 AND user_id = $2;";
    const result = await db.query(query, [bookId, req.session.userId]);
    // console.log(result.rows);
    if (result.rows.length === 0) {
        return res.status(404).send("Book not found");
    } else {
        res.render("addnote.ejs", { 
            book: result.rows[0].book_title,
            id: bookId
        });
    }
}

export async function addNote(req, res) {
    const bookId = parseInt(req.params.id, 10);
    if (isNaN(bookId)) {
        return res.status(400).send("Invalid book ID.");
    }

    const query = "INSERT INTO booknotes (user_id, book_id, book_notes) VALUES ($1,$2,$3);";
    const result = await db.query(query, [req.session.userId, bookId, req.body.new_note]);
    res.redirect(`/notes/view/${bookId}`);
}

export async function deleteNote(req, res) {
    const noteId = parseInt(req.params.id1,10);
    const bookid = parseInt(req.params.id2, 10);
    if (isNaN(noteId)) {
        return res.status(400).send("Invalid note ID.");
    }

    const query = "DELETE FROM booknotes WHERE id = $1 AND user_id = $2;";
    await db.query(query, [noteId, req.session.userId]);
    res.redirect(`/notes/view/${bookid}`);
}

export async function renderEditNote(req, res) {

    const noteId = parseInt(req.params.id1, 10);
    const bookid = parseInt(req.params.id2, 10);
    if (isNaN(noteId) || isNaN(bookid)) {
        return res.status(400).send("Invalid note or book ID.");
    }

    const query = "SELECT book_notes FROM booknotes WHERE id = $1 AND user_id = $2;";
    try {
        const result = await db.query(query, [noteId, req.session.userId]);
        // console.log(result.rows);
        if (result.rows.length === 0) {
            return res.status(404).send("Note not found");
        }

        const note = {
            id: noteId,
            text: result.rows[0].book_notes
        };
        res.render("notesedit.ejs", { 
            note:note,
            bookid:bookid 
        });
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).send("Internal Server Error");
    }
}

export async function updateNote(req, res) {

    const text = req.body.text; 
    const noteId = parseInt(req.params.id1, 10);
    const bookId = parseInt(req.params.id2, 10);
    // console.log(text,noteId,bookId);
    if (isNaN(noteId) || isNaN(bookId)) {
        return res.status(400).send("Invalid note or book ID.");
    }

    const query = "UPDATE booknotes SET book_notes = $1 WHERE id = $2 AND user_id = $3;";
    try {
        await db.query(query, [text, noteId, req.session.userId]);
        res.status(200).json({ message: "Note updated successfully" });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).send("Internal Server Error");
    }
}
