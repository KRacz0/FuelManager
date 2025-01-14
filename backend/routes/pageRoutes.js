const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const authMiddleware = require('../middlewares/authMiddleware');

// Panel administratora - tylko admin
router.get(
    '/admin-panel',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['admin']),
    pageController.getAdminPanel
);

// Dashboard użytkownika - dostęp dla user i admin
router.get(
    '/user-dashboard',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole(['user', 'admin']),
    pageController.getUserDashboard
);

module.exports = router;
