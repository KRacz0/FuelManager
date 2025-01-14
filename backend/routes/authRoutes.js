const express = require('express');
const passport = require('../middlewares/passportConfig');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rejestracja
router.post('/register', authController.register);

// Logowanie
router.post('/login', authController.login);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    authController.facebookCallback
);

// Endpoint do pobierania danych użytkownika
router.get('/current', authMiddleware.authenticate, (req, res) => {
    const { email, role } = req.user;
    res.status(200).json({ email, role });
});

module.exports = router;
