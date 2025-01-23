const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: endpointy użytkowników
 */

/**
 * @swagger
 * /users/stations:
 *   get:
 *     summary: Pobiera listę stacji paliw
 *     description: Zwraca wszystkie stacje paliw dostępne dla użytkownika.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista stacji paliw.
 *       500:
 *         description: Błąd serwera.
 */
router.get('/stations', userController.getStations);

/**
 * @swagger
 * /users/dashboard:
 *   get:
 *     summary: Uzyskanie dostępu do panelu użytkownika
 *     description: Sprawdza autoryzację i zwraca informację o dostępie do panelu użytkownika.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Zwraca informację o dostępie do panelu użytkownika.
 *       401:
 *         description: Brak autoryzacji.
 */
router.get(
    '/dashboard',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['user', 'admin']),
    (req, res) => {
        res.status(200).json({
            message: 'Dostęp do panelu użytkownika przyznany.',
            redirectUrl: '/user-dashboard.html',
        });
    }
);

module.exports = router;
