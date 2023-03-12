const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const util = require("util");

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('database.db');

const ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET';
const REFRESH_TOKEN_SECRET = 'REFRESH_TOKEN_SECRET';
const ACCESS_TOKEN_EXPIRATION = '30m';
const REFRESH_TOKEN_EXPIRATION = 182 * 24 * 60 * 60;

const db_run = util.promisify(db.run).bind(db);
const db_get = util.promisify(db.get).bind(db);
// const db_all = util.promisify(db.all).bind(db);


db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    accessToken TEXT,
    refreshToken TEXT
  )`);
});

// Регистрация пользователя
app.post('/register',
    body('email').isEmail(),
    body('username').isLength({ min: 3 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;

        try {
            const user = await db_get(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, email]);

            if (user) {
                return res.status(400).json({ error: 'Пользователь уже существует' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await db_run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [username, email, hashedPassword]);

            res.status(201).json({ok: true});

        } catch (error){
            console.error(error);
            res.status(500).json({ error: 'Ошибка при регистрации' });
        }
    });

// Авторизация пользователя
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db_get(`SELECT * FROM users WHERE username = ?`, [username]);

        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }

        const accessToken = jwt.sign({ username: user.username, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
        const refreshToken = jwt.sign({ username: user.username, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

        await db_run(`UPDATE users SET accessToken = ?, refreshToken = ? WHERE id = ?`, [accessToken, refreshToken, user.id]);

        res.status(201).json({ accessToken, refreshToken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при авторизации' });
    }
});

// Обновление токена доступа
app.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const user = await db_get(`SELECT * FROM users WHERE refreshToken = ?`, [refreshToken]);
        if (!user) {
            return res.status(401).json({ error: 'Неверный токен обновления' });
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const accessToken = jwt.sign({ username: user.username, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
        await db.run(`UPDATE users SET accessToken = ? WHERE id = ?`, [accessToken, user.id]);

        res.status(201).json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при обновлении токена доступа' });
    }
});

// Получение данных пользователя
app.post('/me', async (req, res) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ error: 'Требуется токен доступа' });
    }
    const accessToken = authorizationHeader.split(' ')[1];

    try {
        const decodedAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

        const user = await db_get(`SELECT username, email FROM users WHERE username = ? AND email = ? AND accessToken = ?`, [decodedAccessToken.username, decodedAccessToken.email, accessToken]);
        if (!user) {
            return res.status(401).json({ error: 'Неверный токен доступа' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
    }
});

app.listen(3001, () => {
    console.log('Сервер запущен на порту 3001');
});
