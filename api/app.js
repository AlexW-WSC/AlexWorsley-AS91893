//setup stuff
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { _ } = require('ajv');
const fs = require('fs');



const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));


//status endpoint
app.get('/status', (req, res) => {
    res.json({
        status: 'Running',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!!!`);
});


//note storage
const notes = [];

//user storage
let users = {};

// load users from file!
const usersFile = path.join(__dirname, 'users.json');
try {
    if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    }
}
catch (error) {
    console.error('No users.json file found, gotta make a new one~')

}

// function to save users to file
function saveUsersToFile() {
    const tmp = usersFile + '.tmp';
    try {
        fs.writeFileSync(tmp, JSON.stringify(users, null, 2), 'utf-8');
        fs.renameSync(tmp, usersFile);

    }
    catch (error) {
        console.error('Error saving users to file:', error);
    }
}

//user endpoints
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/users/register', (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json( { error: 'Bad request: missing user/password' });
    }
});







// note endpoints!

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const { title, text_content, x_position, y_position, category, due_date, priority, size, opacity} = req.body;

    if (title == null || text_content == null || x_position == null || y_position == null || category == null || due_date == null || priority == null || size == null || opacity == null) {
        return res.status(400).json({ error: 'Missing required fields :3' });
    }

    const newNote = {
        id: crypto.randomUUID(),
        title,
        text_content,
        x_position,
        y_position,
        due_date,
        priority,
        category,
        created_at: new Date().toISOString(),
        size,
        opacity
    };

    notes.push(newNote);
    res.status(201).json(newNote);
});


//endpoints for getting, updating, and deleting a note by ID
app.get('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const note = notes.find(note => note.id === noteId);

    if (!note) {
        return res.status(404).json({ error: 'Note not found, 404....' });
    }

    res.json(note);
});

app.patch('/api/notes/:id', (req, res) => { 
    const noteId = req.params.id;
    const note = notes.find(note => note.id === noteId);
    
    if (!note) {
        return res.status(404).json({ error: 'Note not found, 404....' });
    }

    const { x_position, y_position, opacity, title, text_content, category, due_date, priority, size } = req.body;

    if (x_position !== undefined) note.x_position = x_position;
    if (y_position !== undefined) note.y_position = y_position;
    if (opacity !== undefined) note.opacity = opacity;
    if (title !== undefined) note.title = title;
    if (text_content !== undefined) note.text_content = text_content;
    if (category !== undefined) note.category = category;
    if (due_date !== undefined) note.due_date = due_date;
    if (priority !== undefined) note.priority = priority;
    if (size !== undefined) note.size = size;


    res.status(200).json(note);
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
        return res.status(404).json ({error: 'Note not foundddd, 404....'});
    }
    notes.splice(noteIndex, 1);
    res.status(200).json({ message: 'Note deleted successfully' });
});
