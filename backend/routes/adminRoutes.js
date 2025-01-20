const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

console.log('✅ adminRoutes.js został załadowany.');


// Endpoint dostępu do panelu admina
router.get(
    '/panel',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.checkAdminAccess
);

// Endpoint do dodawania stacji
router.post(
    '/add-station',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.addStation
);

// Pobieranie pojedynczej stacji
router.get(
    '/stations/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.getStationById
);

// Aktualizacja stacji paliw
router.patch(
    '/stations/:id',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.updateStation
);


// Pobieranie listy użytkowników
router.get(
    '/users',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.getUsers
);

// Banowanie użytkownika 
router.patch(
    '/users/:id/ban',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.banUser
);

// Pobieranie statystyk użytkownika
router.get(
    '/users/:id/stats',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    adminController.getUserStats
);

module.exports = router;
