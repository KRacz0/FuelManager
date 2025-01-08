<<<<<<< Updated upstream
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.error('Brak tokenu w nagłówkach.');
        return res.status(401).json({ error: 'Brak dostępu: wymagana autoryzacja.' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        console.log('Uwierzytelnianie zakończone sukcesem:', req.user);
        next();
    } catch (error) {
        console.error('Nieprawidłowy token:', error.message);
        res.status(403).json({ error: 'Nieprawidłowy token.' });
    }
};
=======
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.error('Brak tokenu w nagłówkach.');
        return res.status(401).json({ error: 'Brak dostępu: wymagana autoryzacja.' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        console.log('Uwierzytelnianie zakończone sukcesem:', req.user);
        next();
    } catch (error) {
        console.error('Nieprawidłowy token:', error.message);
        res.status(403).json({ error: 'Nieprawidłowy token.' });
    }
};
>>>>>>> Stashed changes
