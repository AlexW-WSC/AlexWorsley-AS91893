const express = require('express');
const app = express();
const crypto = require('crypto');
const { error } = require('console');

app.use(express.json());

const notes = [];

app.get('/status', (req, res) => {
    res.json({
        status: 'Running',
        timestamp: new Date().toISOString(),
        title: "NoticeBoard API by d4rkstar! nice to see you here :3",
    })
});

const PORT = process.env.port || 3000;
app.listen(PORT, () => console.log(`server's up! running on port ${PORT}...`));


app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const {id, text_content, x_position, y_position, category} = req.body;
    console.log(req.body);

    if (!text_content || !x_position || !y_position || !category) {
        return res.status(400).json({ error: 'Missing required fields :3'});
    }

    const newNote = {
        id: crypto.randomUUID(),
        text_content,
        x_position,
        y_position,
        category: category || null,
        created_at: new Date().toISOString(),
    };

    notes.push(newNote);
    res.status(201).json(newNote);
});


