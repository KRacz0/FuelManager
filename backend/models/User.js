const db = require('../utils/db');

class User {
    // Pobieranie użytkownika po ID
    static async getById(userId) {
        const query = `SELECT id, email, points, is_banned FROM users WHERE id = ?`;
        const [rows] = await db.query(query, [userId]);
        return rows[0];
    }

    // Aktualizacja punktów użytkownika
    static async addPoints(userId, points) {
        const query = `UPDATE users SET points = points + ? WHERE id = ?`;
        await db.query(query, [points, userId]);
    }

    // Pobranie listy użytkowników wraz ze statystykami
    static async getAllUsers() {
        const query = `
            SELECT 
                u.id, 
                u.email, 
                u.role, 
                u.is_banned,
                COUNT(fp.id) AS total_proposals,
                SUM(CASE WHEN fp.status = 'approved' THEN 1 ELSE 0 END) AS approved_proposals,
                SUM(CASE WHEN fp.status = 'rejected' THEN 1 ELSE 0 END) AS rejected_proposals
            FROM users u
            LEFT JOIN fuel_proposals fp ON u.id = fp.user_id
            GROUP BY u.id
        `;

        const users = await db.query(query);
        return users;
    }

    // Banowanie użytkownika
    static async banUser(userId, isBanned) {
        const query = `UPDATE users SET is_banned = ? WHERE id = ?`;
        const result = await db.query(query, [isBanned, userId]);

        if (result.affectedRows === 0) {
            return false;
        }

        return true;
    }
}

module.exports = User;
