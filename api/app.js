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

