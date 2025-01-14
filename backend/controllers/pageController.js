const path = require('path');

exports.getAdminPanel = (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/admin-panel.html'));
};

exports.getUserDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/user-dashboard.html'));
};
