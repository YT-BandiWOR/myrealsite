const express = require('express');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors())

const SETTINGS = {
    port: 3001,
    url: `http://localhost:${(this.port)}`,
    db_name: 'database.db',
    register: '/register',
    login: '/login',
    refreshToken: '/refreshToken',
    isAuthed: '/isAuthed',

    salt: 10,
    secret_key: 'MY_SUPER_SECRET_KEY:@RR@Jgj_JG_EFJW)(RJTY31512tQ^@#EDRFTGHY',
    success_live: '1h',
    refresh_live: '180d'
}

// Connection to SQLite3 database
const db = new sqlite3.Database(SETTINGS.db_name);

// Creating a users table
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT, isAuthed INTEGER DEFAULT 0, refresh TEXT DEFAULT "", access TEXT DEFAULT "")');

// Secret key for JWT token
const JWT_SECRET = SETTINGS.secret_key;

const validateEmail = (email) => {
    return true;

    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const validateUsername = (username) => {
    return true;

    return String(username)
        .toLowerCase()
        .match(
            /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
        );
}

const validatePassword = (password) => {
    return password;
}

const generateHash = (string) => {
    const salt = bcrypt.genSaltSync(SETTINGS.salt);
    return bcrypt.hashSync(string, salt);
}

// Route to register a new user
app.post(SETTINGS.register, (req, res) => {
    const { username, password, email } = req.body;

    if (validateEmail(email) && validateUsername(username) && validatePassword(password)) {
        db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
            if (err) {
                res.status(500).json({error: err.message});
            } else if (user) {
                res.status(400).json({error: 'User al-ready exists'});
            } else { // Если пользователя с ником `username` не найдено
                const password_hash = generateHash(password);
                db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password_hash, email], function(err) {
                    if (err) {
                        res.status(400).json({ error: err.message });
                    } else {
                        res.status(201).json({ message: 'User registered successfully' });
                    }
                });
            }
        });
    } else {
        res.status(400).json({error: 'Invalid parameters'});
    }
});

// Route to authenticate user and generate access token and refresh token
app.post(SETTINGS.login, (req, res) => {
    const { username, password } = req.body;

    // Retrieving user details from the database
    db.get('SELECT id, username, password, isAuthed FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!user) {
            res.status(401).json({ error: 'Incorrect username or password' });
        } else {
            const password_hash = generateHash(password);

            if (bcrypt.compareSync(password,  password_hash)) {
                const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: SETTINGS.success_live });
                const refreshToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: SETTINGS.refresh_live });
                console.log(accessToken, '|||', refreshToken);

                db.run('UPDATE users SET isAuthed = 1, access = ?, refresh = ? WHERE id = ?', [accessToken, refreshToken, user.id], function(err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else {
                        res.status(200).json({ accessToken, refreshToken });
                    }
                });
            }
        }
    });
});

// Middleware to verify access token and refresh token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token is missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid access token' });
        } else {
            req.user = decoded.sub;
            next();
        }
    });
};

const verifyRefreshToken = (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token is missing' });
    }

    jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        } else {
            req.user = decoded.sub;
            next();
        }
    });
};

// Route to refresh access token using refresh token
app.post(SETTINGS.refreshToken, verifyRefreshToken, (req, res) => {
// Retrieving user details from the database
    db.get('SELECT id, username FROM users WHERE id = ?', [req.user], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!user) {
            res.status(401).json({ error: 'User not found' });
        } else {
// Generating new access token using JWT
            const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '10m' });
            res.status(200).json({ accessToken });
        }
    });
});

// Route to check if user is authenticated
app.post(SETTINGS.isAuthed, verifyToken, (req, res) => {
    db.get('SELECT id, username, isAuthed FROM users WHERE id = ?', [req.user], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!user) {
            res.status(401).json({ error: 'User not found' });
        } else {
            console.log(user);
            res.status(200).json({ username: user.username });
        }
    });
});

// Starting the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
