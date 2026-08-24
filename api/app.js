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
let notes = [];

// load from file.
const notesFile = path.join(__dirname, 'notes.json')
try {
    if (fs.existsSync(notesFile)) {
        notes = JSON.parse(fs.readFileSync(notesFile, 'utf-8'));
    }

}
catch (error) {
    console.error('No notes.json file found, gotta make a new one~')

}



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

// function to save notes to file
function saveNotesToFile() {
    const tmp = notesFile + '.tmp';
    try {
        fs.writeFileSync(tmp, JSON.stringify(notes, null, 2), 'utf-8');
        fs.renameSync(tmp, notesFile);
    }
    catch (error) {
        console.error('Error saving notes to file:', error);
    }
}

//user endpoints
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/users/register', (req, res) => {
    const { username, password } = req.body;
    const cleanUsername = String(username || '').trim();
    const cleanPassword = String(password || '').trim();

    if (!cleanUsername || !cleanPassword) {
        return res.status(400).json({ error: 'Bad request: missing user/password' });
    }

    if (users[cleanUsername]) {
        return res.status(409).json({ error: 'this username is taken, please sign in uwu' });
    }

    const passwordHash = crypto.createHash('sha256').update(cleanPassword).digest('hex');
    users[cleanUsername] = {
        username: cleanUsername,
        password: passwordHash
    };

    saveUsersToFile();

    return res.status(201).json({
        message: 'User registered successfully',
        username: cleanUsername
    });
});


app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;

    const cleanUsername = String(username || '').trim();
    const cleanPassword = String(password || '').trim();

    if (!cleanUsername || !cleanPassword) {
        return res.status(400).json({ error: 'Bad request: missing user/password' });
    }

    const foundUser = users[cleanUsername];

    if (!foundUser) {
        return res.status(401).json({error: 'Invalid user/password'});
    }

    const enteredHash = crypto
        .createHash('sha256')
        .update(cleanPassword)
        .digest('hex');

    if (enteredHash !== foundUser.password) {
        return res.status(401).json({ error: 'Invalid user/password' });
    }

    return res.status(200).json({
        message: 'Login Success!!',
        username: cleanUsername
    });
});

// note endpoints!

app.get('/api/notes', (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({error: 'username query parameter required.'})
    }
    const userNotes = notes.filter(note => note.username ===username);
    res.json(userNotes);
});

app.post('/api/notes', (req, res) => {
    const { username, title, text_content, x_position, y_position, category, due_date, priority, size, opacity} = req.body;

    if (!username) {
        return res.status(400).json({ error: 'username required' });
    }

    if (title == null || text_content == null || x_position == null || y_position == null || category == null || due_date == null || priority == null || size == null || opacity == null) {
        return res.status(400).json({ error: 'Missing required fields :3' });
    }

    const newNote = {
        id: crypto.randomUUID(),
        username,
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
    saveNotesToFile();
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
    const { username, x_position, y_position, opacity, title, text_content, category, due_date, priority, size } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'username required' });
    }

    const note = notes.find(note => note.id === noteId);

    if (!note) {
        return res.status(404).json({ error: 'Note not found, 404....' });
    }

    if (note.username !== username) {
        return res.status(403).json({ error: 'no auth: you do not own this note?? how are you doing this lmao' });
    }

    if (x_position !== undefined) note.x_position = x_position;
    if (y_position !== undefined) note.y_position = y_position;
    if (opacity !== undefined) note.opacity = opacity;
    if (title !== undefined) note.title = title;
    if (text_content !== undefined) note.text_content = text_content;
    if (category !== undefined) note.category = category;
    if (due_date !== undefined) note.due_date = due_date;
    if (priority !== undefined) note.priority = priority;
    if (size !== undefined) note.size = size;

    saveNotesToFile();
    res.status(200).json(note);
});

app.delete('/api/notes/:id', (req, res) => {
    const { username } = req.body;
    const noteId = req.params.id;

    if (!username) {
        return res.status(400).json({ error: 'username required' });
    }

    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
        return res.status(404).json ({error: 'Note not foundddd, 404....'});
    }

    const note = notes[noteIndex];
    if (note.username !== username) {
        return res.status(403).json({ error: 'not yours bro unauthorised' });
    }

    notes.splice(noteIndex, 1);
    saveNotesToFile();
    res.status(200).json({ message: 'Note deleted successfully' });
});

//userprefs 
app.get('/api/users/preferences', (req, res) => {
    const { username } = req.query;

    if (!username || !users[username]) {
        return res.status(404).json({ error: 'user not foundd' });
    }

    return res.json({
        username,
        theme: users[username].theme || 'light',
        font: users[username].font || 'regular'
    });
});

app.post('/api/users/preferences', (req, res) => {
    const { username, theme, font } = req.body;
    if (!username || !users[username]) {
        return res.status(404).json({ error: "user not foundd"})
    }

    if (theme !== undefined && !['light', 'dark'].includes(theme)) {
        return res.status(400).json({ error: "theme not valid lmao"})
    }

    if (font !== undefined && !['regular', 'dyslexic'].includes(font)) {
        return res.status(400).json({ error: "font not valid!"})
    }

    if (theme !== undefined) users[username].theme = theme;
    if (font !== undefined) users[username].font = font;

    saveUsersToFile();

    res.json({
        username, 
        theme: users[username].theme || 'light',
        font: users[username].font || 'regular'
    })
})
