const Station = require('../models/Station');

exports.getStations = async (req, res) => {
    try {
        const stations = await Station.getAll();
        res.status(200).json(stations);
    } catch (error) {
        console.error('Błąd podczas pobierania stacji:', error.message);
        res.status(500).json({ error: 'Nie udało się pobrać danych o stacjach.' });
    }
};

