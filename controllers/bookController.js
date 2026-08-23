import db from "../config/database.js";
import axios from "axios";

export async function renderHome(req, res) {
    try {
        const query = "SELECT * FROM notes WHERE user_id = $1 ORDER BY id ASC";
        const result = await db.query(query, [req.session.userId]);
        
        // Concurrent API calls instead of sequential(earlier i use single api calls but that resulted in 
        // drastically slow home page load as each book api call was taking about 2 3 sec to load)
        const apiCalls = result.rows.map(async (book) => {
            const isbn = book.book_isbn.trim();
            const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${encodeURIComponent(isbn)}&format=json&jscmd=data`;

            try {
                const response = await axios.get(url);
                const data = response.data[`ISBN:${isbn}`];
                
                if (data) {
                    // Process subjects/tags
                    let tags = data.subjects && data.subjects.length > 0 ? data.subjects[0].name : "No subjects available";
                    for(let k = 1; k < Math.min(data.subjects?.length || 0, 3); k++) {
                        tags += ", " + data.subjects[k].name;
                    }
                    // console.log(data.cover)
                    return {
                        ...book,
                        tags: tags,
                        cover: data.cover ? data.cover.large : `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
                        pages: data.number_of_pages || "not available",
                        publish_date: data.publish_date || "not available",
                        publishers: (data.publishers && data.publishers.length > 0) ? data.publishers[0].name : "not available",
                        linkurl: data.url || "not available"
                    };
                }
                
                // Return original book if no API data
                return book;
                
            } catch (error) {
                console.error(`API error for ${book.book_title}:`, error.message);
                return book;
            }
        });

        // Execute all API calls simultaneously
        const booksWithData = await Promise.all(apiCalls);
        
        res.render("home.ejs", { books: booksWithData });
        
    } catch (error) {
        console.error("Error loading home:", error);
        res.status(500).send("Internal Server Error");
    }
}



export function renderAddBook(req, res) {
    res.render("add.ejs");
}

export async function addBook(req, res) {
    try{
        const query = "INSERT INTO notes (user_id,book_isbn,book_notes_date,book_rating,book_title,author) VALUES ($1,$2,$3,$4,$5,$6)";
        await db.query(query, [req.session.userId, req.body.isbn, req.body.start_date, req.body.rating, req.body.title, req.body.author]);
        res.redirect("/");
    }
    catch(err){
        console.log(err,"error adding book");
        res.status(500).send("Error adding book");
    }
}
