const Station = require('../models/Station');
const FuelProposal = require('../models/FuelProposal');
const User = require('../models/User');
const upload = require('../middlewares/upload');
const path = require('path');

// Pobieranie wszystkich stacji (dla użytkowników i administratorów)
exports.getStations = async (req, res) => {
    try {
        console.log('Żądanie pobrania stacji otrzymane');
        const stations = await Station.getAll();
        res.status(200).json(stations);
    } catch (error) {
        console.error('Błąd podczas pobierania stacji:', error.message);
        res.status(500).json({ error: 'Nie udało się pobrać danych o stacjach.' });
    }
};

// Dodawanie stacji (dla administratorów)
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
        console.error('Błąd podczas dodawania stacji:', error.message);
        res.status(500).json({ error: 'Nie udało się dodać stacji.' });
    }
};

// Proponowanie zmiany cen paliw (dla użytkowników)
exports.proposePriceChange = [
    upload.single('image'),
    async (req, res) => {
        const { stationId, fuelType, newPrice } = req.body;
        const userId = req.user.id;

        const validFuelTypes = ['fuel_diesel', 'fuel_gasoline', 'fuel_lpg'];
        if (!stationId || !fuelType || !newPrice || !validFuelTypes.includes(fuelType)) {
            return res.status(400).json({ error: 'Wszystkie pola są wymagane i muszą być poprawne!' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Załączone zdjęcie jest wymagane.' });
        }

        try {
            const imagePath = path.relative(path.join(__dirname, '../../uploads'), req.file.path);

            await FuelProposal.addProposal({
                stationId,
                fuelType,
                newPrice,
                userId,
                imagePath
            });

            res.status(201).json({ message: 'Propozycja zmiany cen została zgłoszona.' });
        } catch (error) {
            res.status(500).json({ error: 'Nie udało się zgłosić propozycji.' });
        }
    }
];

// Pobieranie wszystkich propozycji z opcjonalnym filtrem
exports.getProposals = async (req, res) => {
    try {
        const { status } = req.query;
        const proposals = await FuelProposal.getAll({ status });

        res.status(200).json(proposals);
    } catch (error) {
        console.error('Błąd podczas pobierania propozycji:', error.message);
        res.status(500).json({ error: 'Nie udało się pobrać propozycji.' });
    }
};


// Pobieranie szczegółów jednej propozycji
exports.getProposalDetails = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const proposal = await FuelProposal.getById(proposalId);

        if (!proposal) {
            return res.status(404).json({ error: 'Propozycja nie istnieje.' });
        }

        res.status(200).json(proposal);
    } catch (error) {
        console.error('Błąd podczas pobierania szczegółów propozycji:', error.message);
        res.status(500).json({ error: 'Nie udało się pobrać szczegółów propozycji.' });
    }
};

// Zmiana statusu propozycji
exports.updateProposalStatus = async (req, res) => {
    try {
        const proposalId = parseInt(req.params.proposalId, 10);
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Nieprawidłowy status.' });
        }

        const proposal = await FuelProposal.getById(proposalId);
        if (!proposal) {
            console.error(`Propozycja o ID ${proposalId} nie istnieje w bazie!`);
            return res.status(404).json({ error: 'Propozycja nie istnieje.' });
        }

        const success = await FuelProposal.updateProposalStatus(proposalId, status);
        if (!success) {
            return res.status(500).json({ error: 'Nie udało się zaktualizować propozycji.' });
        }

        if (status === 'approved') {
            await User.addPoints(proposal.user_id, 10);
        }

        res.status(200).json({ message: `Propozycja została ${status === 'approved' ? 'zaakceptowana i cena paliwa została zaktualizowana' : 'odrzucona'}.` });
    } catch (error) {
        console.error('Błąd podczas aktualizacji statusu propozycji:', error.message);
        res.status(500).json({ error: 'Nie udało się zaktualizować statusu propozycji.' });
    }
};

// statystyki propozycji
exports.getProposalStatistics = async (req, res) => {
    try {
        const stats = await FuelProposal.getStatistics();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Błąd podczas pobierania statystyk:', error.message);
        res.status(500).json({ error: 'Nie udało się pobrać statystyk.' });
    }
};
