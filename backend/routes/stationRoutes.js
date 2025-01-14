const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// Pobieranie wszystkich stacji
router.get('/', authMiddleware.authenticate, stationController.getStations);

// Dodawanie stacji (tylko dla administratorów)
router.post(
    '/',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    stationController.addStation
);

// Proponowanie zmian cen paliw (dla użytkowników)
router.post(
    '/propose-change',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['user', 'admin']),
    stationController.proposePriceChange
);

// Aktualizacja statusu propozycji (dla adminów)
router.patch(
    '/proposals/:id/status',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    stationController.updateProposalStatus
);

// Pobieranie wszystkich propozycji
router.get(
    '/proposals',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    stationController.getProposals
);

// Pobieranie szczegółów propozycji
router.get(
    '/proposals/:proposalId',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    stationController.getProposalDetails
);

// Aktualizacja statusu propozycji
router.patch(
    '/proposals/:proposalId/status',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    stationController.updateProposalStatus
);

// Pobieranie statystyk propozycji
router.get(
    '/proposals/statistics',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    stationController.getProposalStatistics
);

module.exports = router;
