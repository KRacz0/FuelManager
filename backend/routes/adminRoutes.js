const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpointy dla administratora
 */

/**
 * @swagger
 * /admin/panel:
 *   get:
 *     summary: Sprawdza dostęp do panelu administratora
 *     description: Endpoint zwraca informację, czy użytkownik ma dostęp do panelu administratora.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dostęp przyznany.
 *       403:
 *         description: Brak uprawnień.
 */
router.get(
    '/panel',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.checkAdminAccess
);

/**
 * @swagger
 * /admin/add-station:
 *   post:
 *     summary: Dodaje nową stację paliw
 *     description: Administrator może dodać nową stację paliw.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Stacja ORLEN Kraków"
 *               brand:
 *                 type: string
 *                 example: "ORLEN"
 *               address:
 *                 type: string
 *                 example: "ul. Grodzka 12, Kraków"
 *               latitude:
 *                 type: string
 *                 example: "50.06143"
 *               longitude:
 *                 type: string
 *                 example: "19.93658"
 *               fuel_diesel:
 *                 type: number
 *                 example: 6.20
 *               fuel_gasoline:
 *                 type: number
 *                 example: 5.99
 *               fuel_lpg:
 *                 type: number
 *                 example: 3.30
 *     responses:
 *       201:
 *         description: Stacja została dodana.
 *       400:
 *         description: Nieprawidłowe dane wejściowe.
 *       403:
 *         description: Brak uprawnień.
 */
router.post(
    '/add-station',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.addStation
);

/**
 * @swagger
 * /admin/stations/{id}:
 *   get:
 *     summary: Pobiera dane konkretnej stacji paliw
 *     description: Zwraca informacje o stacji na podstawie ID.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID stacji paliw
 *     responses:
 *       200:
 *         description: Informacje o stacji.
 *       403:
 *         description: Brak uprawnień.
 *       404:
 *         description: Stacja nie istnieje.
 */
router.get(
    '/stations/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.getStationById
);

/**
 * @swagger
 * /admin/stations/{id}:
 *   patch:
 *     summary: Edytuje dane stacji paliw
 *     description: Administrator może edytować nazwę, markę, adres, współrzędne oraz ceny paliw.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID stacji paliw
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Stacja BP Warszawa"
 *               brand:
 *                 type: string
 *                 example: "BP"
 *               address:
 *                 type: string
 *                 example: "ul. Marszałkowska 24, Warszawa"
 *               latitude:
 *                 type: string
 *                 example: "52.22967500"
 *               longitude:
 *                 type: string
 *                 example: "21.01223000"
 *               fuel_diesel:
 *                 type: number
 *                 example: 6.30
 *               fuel_gasoline:
 *                 type: number
 *                 example: 5.99
 *               fuel_lpg:
 *                 type: number
 *                 example: 3.45
 *     responses:
 *       200:
 *         description: Zaktualizowano stację paliw.
 *       400:
 *         description: Nieprawidłowe dane wejściowe.
 *       403:
 *         description: Brak uprawnień.
 *       404:
 *         description: Stacja paliw nie istnieje.
 */
router.patch(
    '/stations/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.updateStation
);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Pobiera listę użytkowników
 *     description: Tylko administratorzy mogą pobrać listę użytkowników.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista użytkowników.
 *       403:
 *         description: Brak uprawnień.
 */
router.get(
    '/users',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.getUsers
);

/**
 * @swagger
 * /admin/users/{id}/ban:
 *   patch:
 *     summary: Banuje użytkownika
 *     description: Administrator może zbanować użytkownika.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Użytkownik został zbanowany.
 *       403:
 *         description: Brak uprawnień.
 *       404:
 *         description: Użytkownik nie istnieje.
 */
router.patch(
    '/users/:id/ban',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.banUser
);

/**
 * @swagger
 * /admin/users/{id}/stats:
 *   get:
 *     summary: Pobiera statystyki użytkownika
 *     description: Zwraca liczbę zaakceptowanych i odrzuconych propozycji cen paliw.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Statystyki użytkownika.
 *       403:
 *         description: Brak uprawnień.
 *       404:
 *         description: Użytkownik nie istnieje.
 */
router.get(
    '/users/:id/stats',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.getUserStats
);

module.exports = router;
