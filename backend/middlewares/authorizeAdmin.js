module.exports = (req, res, next) => {
    if (!req.user) {
        console.error('Użytkownik niezalogowany.');
        return res.status(403).json({ error: 'Brak dostępu: niezalogowany użytkownik.' });
    }

    if (req.user.role !== 'admin') {
        console.error(`Brak dostępu: Użytkownik ${req.user.email || 'nieznany'} nie jest adminem.`);
        return res.status(403).json({ error: 'Brak dostępu: wymagane uprawnienia administratora.' });
    }

    console.log(`Dostęp przyznany: Użytkownik ${req.user.email} jest adminem.`);
    next();
};
