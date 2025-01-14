const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Middleware do uwierzytelniania użytkownika
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!authHeader) {
        console.error('Brak nagłówka Authorization.');
    }
    if (!token) {
        console.error('Brak tokenu w nagłówku Authorization.');
        if (req.accepts('html')) {
            return res.redirect('/unauthorized.html');
        }
        return res.status(401).json({ error: 'Brak dostępu: wymagana autoryzacja.' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        console.log('Uwierzytelnianie zakończone sukcesem:', req.user);
        next();
    } catch (error) {
        console.error('Nieprawidłowy token:', error.message);
        if (req.accepts('html')) {
            return res.redirect('/unauthorized.html');
        }
        return res.status(403).json({ error: 'Nieprawidłowy token.' });
    }
};


exports.authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        console.log('Sprawdzanie roli użytkownika:', req.user.role);
        console.log('Dozwolone role:', allowedRoles);

        if (!req.user) {
            console.error('Użytkownik niezalogowany.');
            if (req.accepts('html')) {
                return res.redirect('/unauthorized.html');
            }
            return res.status(401).json({ error: 'Brak dostępu: wymagana autoryzacja.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            console.error(
                `Brak dostępu: Użytkownik ${req.user.email || 'nieznany'} nie ma odpowiednich uprawnień.`
            );
            if (req.accepts('html')) {
                return res.redirect('/unauthorized.html');
            }
            return res.status(403).json({ error: 'Brak dostępu: niewystarczające uprawnienia.' });
        }

        console.log(
            `Dostęp przyznany: Użytkownik ${req.user.email} ma odpowiednie uprawnienia (${req.user.role}).`
        );
        next();
    };
};



