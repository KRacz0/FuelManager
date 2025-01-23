const express = require('express');
const passport = require('../middlewares/passportConfig');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: endpointy dotyczące uwierzytelniania użytkowników
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Rejestracja nowego użytkownika
 *     description: Tworzy nowe konto użytkownika.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "SecurePassword123!"
 *     responses:
 *       201:
 *         description: Użytkownik został pomyślnie zarejestrowany.
 *       400:
 *         description: Nieprawidłowe dane wejściowe.
 *       409:
 *         description: Użytkownik już istnieje.
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logowanie użytkownika
 *     description: Użytkownik loguje się do systemu.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@cenypaliwka.pl"
 *               password:
 *                 type: string
 *                 example: "paliwka123"
 *     responses:
 *       200:
 *         description: Logowanie udane, zwraca token JWT.
 *       400:
 *         description: Nieprawidłowe dane wejściowe.
 *       401:
 *         description: Błędne dane logowania.
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Logowanie przez Facebook
 *     description: Rozpoczyna proces uwierzytelniania przez Facebook OAuth 2.0.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Przekierowanie do Facebooka w celu logowania.
 */
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     summary: Callback dla Facebook OAuth
 *     description: Obsługuje powrót użytkownika po uwierzytelnieniu przez Facebook.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Sukces - przekierowanie do aplikacji.
 *       401:
 *         description: Autoryzacja przez Facebook nie powiodła się.
 */
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    authController.facebookCallback
);

/**
 * @swagger
 * /auth/current:
 *   get:
 *     summary: Pobiera dane aktualnie zalogowanego użytkownika
 *     description: Zwraca adres email i rolę aktualnie zalogowanego użytkownika.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sukces - zwraca dane użytkownika.
 *       401:
 *         description: Brak autoryzacji.
 */
router.get('/current', authMiddleware.authenticate, (req, res) => {
    const { email, role } = req.user;
    res.status(200).json({ email, role });
});

module.exports = router;
