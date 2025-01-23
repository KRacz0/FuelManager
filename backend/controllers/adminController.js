const db = require('../utils/db');
const Station = require('../models/Station');
const User = require('../models/User');

// Sprawdzanie dostępu do panelu admina
exports.checkAdminAccess = (req, res) => {
    console.log(`Przyznano dostęp do panelu admina użytkownikowi ${req.user.email}`);
    res.status(200).json({
        message: 'Dostęp do panelu administratora przyznany.',
        redirectUrl: '/admin-panel.html',
    });
};

// Dodawanie stacji paliw
exports.addStation = async (req, res) => {
    const { name, brand, address, latitude, longitude, fuel_diesel, fuel_gasoline, fuel_lpg } = req.body;

    if (!name || !brand || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'Wszystkie pola są wymagane!' });
    }

    try {
        const station = {
            name,
            brand,
            address,
            latitude,
            longitude,
            fuel_diesel: fuel_diesel || null,
            fuel_gasoline: fuel_gasoline || null,
            fuel_lpg: fuel_lpg || null,
        };

        await Station.add(station);

        res.status(201).json({ message: 'Stacja została dodana pomyślnie.' });
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się dodać stacji.' });
    }
};

// Pobieranie listy użytkowników
exports.getUsers = async (req, res) => {
    try {
        const users = await db.query(`SELECT id, email, role, created_at, is_banned FROM users`);
        
        if (!Array.isArray(users)) {
            return res.status(500).json({ error: 'Błąd pobierania użytkowników.' });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się pobrać listy użytkowników.' });
    }
};


// Banowanie użytkownika
exports.banUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(`
            UPDATE users SET is_banned = 1 WHERE id = ?
        `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Użytkownik nie istnieje.' });
        }

        res.status(200).json({ message: 'Użytkownik został zbanowany.' });
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się zbanować użytkownika.' });
    }
};

// Pobieranie statystyk użytkownika (liczba zaakceptowanych/odrzuconych propozycji)
exports.getUserStats = async (req, res) => {
    const { id } = req.params;
    try {
        const stats = await db.query(`
            SELECT 
                COUNT(CASE WHEN status = 'approved' THEN 1 END) AS accepted_proposals,
                COUNT(CASE WHEN status = 'rejected' THEN 1 END) AS rejected_proposals
            FROM fuel_proposals WHERE user_id = ?
        `, [id]);

        if (!stats.length) {
            return res.status(404).json({ error: 'Brak statystyk dla tego użytkownika.' });
        }

        res.status(200).json(stats[0]);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się pobrać statystyk użytkownika.' });
    }
};

// Pobieranie jednej stacji po ID
exports.getStationById = async (req, res) => {
    const { id } = req.params;

    try {
        const [station] = await db.query('SELECT * FROM fuel_stations WHERE id = ?', [id]);

        if (!station) {
            return res.status(404).json({ error: 'Stacja nie istnieje.' });
        }

        res.status(200).json(station);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się pobrać stacji.' });
    }
};


// Edycja stacji paliw
exports.updateStation = async (req, res) => {
    const { id } = req.params;
    const { name, brand, address, latitude, longitude, fuel_diesel, fuel_gasoline, fuel_lpg } = req.body;

    if (!name || !brand || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'Wszystkie pola są wymagane!' });
    }

    try {
        const stationData = {
            name,
            brand,
            address,
            latitude,
            longitude,
            fuel_diesel: fuel_diesel || null,
            fuel_gasoline: fuel_gasoline || null,
            fuel_lpg: fuel_lpg || null,
        };

        const result = await Station.update(id, stationData);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Stacja nie istnieje.' });
        }
        res.status(200).json({ message: 'Dane stacji zostały zaktualizowane pomyślnie.' });
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się zaktualizować danych stacji.' });
    }
};

