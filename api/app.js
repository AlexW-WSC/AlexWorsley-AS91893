const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { _ } = require('ajv');

const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

//note storage
const notes = [];


app.get('/status', (req, res) => {
    res.json({
        status: 'Running',
        timestamp: new Date().toISOString(),
        title: "NoticeBoard API by d4rkstar! nice to see you here :3",
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!!!`);
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const { title, text_content, x_position, y_position, category } = req.body;

    if (!title || !text_content || !x_position || !y_position || !category) {
        return res.status(400).json({ error: 'Missing required fields :3' });
    }

    const newNote = {
        id: crypto.randomUUID(),
        title,
        text_content,
        x_position,
        y_position,
        category,
        created_at: new Date().toISOString(),
    };

    notes.push(newNote);
    res.status(201).json(newNote);
});

app.patch('/api/notes/:id', (req, res) => {
    // get note id, patch new position data. do this when you have time please ^^ it's done on the client-side
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
        return res.status(404).json ({error: 'Not not foundddd, 404....'});
    }
    notes.splice(noteIndex, 1);
    res.status(200).json({ message: 'Note deleted successfully' });
});
