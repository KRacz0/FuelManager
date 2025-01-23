const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Pages
 *   description: endpointy związane z dostępem do paneli użytkownika i administratora
 */

/**
 * @swagger
 * /pages/admin-panel:
 *   get:
 *     summary: Panel administratora
 *     description: Zwraca panel administratora, dostępny tylko dla użytkowników z rolą `admin`.
 *     tags: [Pages]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Zwraca panel administratora.
 *       401:
 *         description: Brak autoryzacji.
 *       403:
 *         description: Brak uprawnień do dostępu.
 */
router.get(
    '/admin-panel',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    pageController.getAdminPanel
);

/**
 * @swagger
 * /pages/user-dashboard:
 *   get:
 *     summary: Dashboard użytkownika
 *     description: Zwraca panel użytkownika, dostępny dla `user` i `admin`.
 *     tags: [Pages]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Zwraca panel użytkownika.
 *       401:
 *         description: Brak autoryzacji.
 *       403:
 *         description: Brak uprawnień do dostępu.
 */
router.get(
    '/user-dashboard',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['user', 'admin']),
    pageController.getUserDashboard
);

module.exports = router;
