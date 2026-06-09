const express = require('express');
const path = require('path');
const crypto = require('crypto');

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
