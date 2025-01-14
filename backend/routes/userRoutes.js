const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Pobieranie stacji paliw
router.get('/stations', userController.getStations);

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
