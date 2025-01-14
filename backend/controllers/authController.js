const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const config = require('../config/config');

exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log('Query result:', rows);

        if (rows.length > 0) {
            return res.status(400).json({ error: 'Email is already registered!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

        console.log(`User registered successfully: ${email}`);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ error: 'Registration failed!' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password!' });
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


exports.facebookCallback = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Autoryzacja przez Facebook nie powiodła się.' });
    }

    try {
        const token = jwt.sign(
            { id: req.user.id, email: req.user.email, role: req.user.role },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const redirectUrl = req.user.role === 'admin' ? '/admin-panel' : '/user-dashboard';

        res.redirect(`${redirectUrl}?token=${token}`);
    } catch (error) {
        console.error('Błąd podczas przetwarzania callbacku Facebook:', error.message);
        res.status(500).json({ error: 'Facebook authentication failed.' });
    }
};


