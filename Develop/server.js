const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set the public directory as a static folder
app.use(express.static('public'));

// API routes

// GET route for retrieving all notes from db.json
app.get('/api/notes', (req, res) => {
fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while reading notes.' });
    }

    let notes;
    try {
    notes = JSON.parse(data);
    } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while parsing notes.' });
    }

    return res.json(notes);
});
});

// POST route for creating a new note
app.post('/api/notes', (req, res) => {
const { title, text } = req.body;

if (!title || !text) {
    return res.status(400).json({ error: 'Title and text are required fields.' });
}

fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while reading notes.' });
    }

    let notes;
    try {
    notes = JSON.parse(data);
    } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while parsing notes.' });
    }

    const newNote = {
      id: Math.floor(Math.random() * 1000), // Generate a random ID (you can use npm packages for more reliable ID generation)
    title,
    text,
    };

    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes), (err) => {
    if (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occurred while saving the note.' });
    }

    return res.json(newNote);
    });
});
});

// HTML routes

// Route for notes page
app.get('/notes', (req, res) => {
res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Route for homepage
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(PORT, () => {
console.log(`Server is listening on PORT ${PORT}`);
});
