const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const config = require('../config/config');

exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).json({ error: 'Email is already registered!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed!' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ error: 'Niepoprawny email lub hasło!' });
        }

        if (user.is_banned) {
            return res.status(403).json({ error: 'Twoje konto zostało zbanowane. Nie możesz się zalogować.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Niepoprawny email lub hasło!' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log('Użytkownik zalogowany:', user.email);

        res.status(200).json({
            token,
            redirectUrl: user.role === 'admin' ? '/admin-panel' : '/user-dashboard',
        });
    } catch (error) {
        console.error('Błąd podczas logowania:', error.message);
        res.status(500).json({ error: 'Login failed!' });
    }
};


exports.facebookCallback = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Autoryzacja przez Facebook nie powiodła się.' });
    }

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ error: 'Użytkownik nie istnieje.' });
        }

        if (user.is_banned) {
            return res.status(403).json({ error: 'Twoje konto zostało zbanowane. Nie możesz się zalogować.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const redirectUrl = user.role === 'admin' ? '/admin-panel' : '/user-dashboard';

        res.redirect(`${redirectUrl}?token=${token}`);
    } catch (error) {
        res.status(500).json({ error: 'Facebook authentication failed.' });
    }
};



