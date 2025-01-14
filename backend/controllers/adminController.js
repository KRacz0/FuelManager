const db = require('../utils/db');

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

        await db.addStation(station);
        res.status(201).json({ message: 'Stacja została dodana pomyślnie.' });
    } catch (error) {
        console.error('Błąd podczas dodawania stacji:', error.message);
        res.status(500).json({ error: 'Nie udało się dodać stacji.' });
    }
};
