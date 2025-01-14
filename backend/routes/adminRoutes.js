const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

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

module.exports = router;
