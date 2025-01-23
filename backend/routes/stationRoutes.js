const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: Stations
 *   description: endpointy związane ze stacjami paliw i propozycjami cen
 */

/**
 * @swagger
 * /stations:
 *   get:
 *     summary: Pobiera wszystkie stacje paliw
 *     description: Zwraca listę wszystkich dostępnych stacji paliw.
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista stacji paliw.
 *       401:
 *         description: Brak autoryzacji.
 */
router.get('/', authMiddleware.authenticate, stationController.getStations);

/**
 * @swagger
 * /stations:
 *   post:
 *     summary: Dodaje nową stację paliw
 *     description: Dodaje nową stację paliw do systemu (tylko dla administratorów).
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - brand
 *               - address
 *               - latitude
 *               - longitude
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Stacja ORLEN Kraków"
 *               brand:
 *                 type: string
 *                 example: "ORLEN"
 *               address:
 *                 type: string
 *                 example: "ul. Wielicka 100, Kraków"
 *               latitude:
 *                 type: number
 *                 example: 50.06465
 *               longitude:
 *                 type: number
 *                 example: 19.94498
 *               fuel_diesel:
 *                 type: number
 *                 example: 6.30
 *               fuel_gasoline:
 *                 type: number
 *                 example: 6.10
 *               fuel_lpg:
 *                 type: number
 *                 example: 3.45
 *     responses:
 *       201:
 *         description: Stacja została dodana.
 *       400:
 *         description: Nieprawidłowe dane wejściowe.
 *       401:
 *         description: Brak autoryzacji.
 *       403:
 *         description: Brak uprawnień do dodania stacji.
 */
router.post(
    '/',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    stationController.addStation
);

/**
 * @swagger
 * /stations/propose-change:
 *   post:
 *     summary: Propozycja zmiany ceny paliwa
 *     description: Użytkownik może zaproponować zmianę ceny paliwa na stacji.
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stationId
 *               - fuelType
 *               - newPrice
 *             properties:
 *               stationId:
 *                 type: integer
 *                 example: 1
 *               fuelType:
 *                 type: string
 *                 enum: ["diesel", "gasoline", "lpg"]
 *                 example: "diesel"
 *               newPrice:
 *                 type: number
 *                 example: 6.20
 *     responses:
 *       201:
 *         description: Propozycja została dodana.
 *       400:
 *         description: Nieprawidłowe dane wejściowe.
 *       401:
 *         description: Brak autoryzacji.
 */
router.post(
    '/propose-change',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['user', 'admin']),
    stationController.proposePriceChange
);

/**
 * @swagger
 * /stations/proposals:
 *   get:
 *     summary: Pobiera wszystkie propozycje cen paliw
 *     description: Zwraca listę wszystkich propozycji zmiany cen paliw (tylko dla administratorów).
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista propozycji cen paliw.
 *       401:
 *         description: Brak autoryzacji.
 *       403:
 *         description: Brak uprawnień.
 */
router.get(
    '/proposals',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    stationController.getProposals
);

/**
 * @swagger
 * /stations/proposals/{proposalId}/status:
 *   patch:
 *     summary: Aktualizacja statusu propozycji
 *     description: Administrator może zatwierdzić lub odrzucić propozycję zmiany ceny paliwa.
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID propozycji
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["approved", "rejected"]
 *                 example: "approved"
 *     responses:
 *       200:
 *         description: Status propozycji został zaktualizowany.
 *       400:
 *         description: Nieprawidłowe dane wejściowe.
 *       401:
 *         description: Brak autoryzacji.
 *       403:
 *         description: Brak uprawnień.
 */
router.patch(
    '/proposals/:proposalId/status',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    stationController.updateProposalStatus
);

/**
 * @swagger
 * /stations/proposals/{proposalId}:
 *   get:
 *     summary: Pobiera szczegóły propozycji zmiany ceny paliwa
 *     description: Administrator może pobrać szczegółowe informacje na temat propozycji.
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID propozycji
 *     responses:
 *       200:
 *         description: Szczegóły propozycji.
 *       401:
 *         description: Brak autoryzacji.
 *       403:
 *         description: Brak uprawnień.
 */
router.get(
    '/proposals/:proposalId',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    stationController.getProposalDetails
);

/**
 * @swagger
 * /stations/proposals/statistics:
 *   get:
 *     summary: Pobiera statystyki dotyczące propozycji cen paliw
 *     description: Administrator może uzyskać statystyki dotyczące propozycji zmian cen paliw.
 *     tags: [Stations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statystyki propozycji cen paliw.
 *       401:
 *         description: Brak autoryzacji.
 *       403:
 *         description: Brak uprawnień.
 */
router.get(
    '/proposals/statistics',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    stationController.getProposalStatistics
);

module.exports = router;
