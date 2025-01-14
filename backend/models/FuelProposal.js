const db = require('../utils/db');

class FuelProposal {
    // Dodawanie nowej propozycji
    static async addProposal({ stationId, fuelType, newPrice, userId, imagePath }) {
        const query = `
            INSERT INTO fuel_proposals (station_id, fuel_type, new_price, user_id, image_path, created_at, status)
            VALUES (?, ?, ?, ?, ?, NOW(), 'pending')
        `;
        const values = [stationId, fuelType, newPrice, userId, imagePath];
        await db.query(query, values);
    }

    // Aktualizacja statusu propozycji
    static async updateProposalStatus(proposalId, status) {
        const query = `
            UPDATE fuel_proposals
            SET status = ?
            WHERE id = ?
        `;
        const values = [status, proposalId];
        await db.query(query, values);
    }

    // Pobieranie propozycji według statusu
    static async getProposalsByStatus(status) {
        const query = `
            SELECT * FROM fuel_proposals
            WHERE status = ?
        `;
        const [proposals] = await db.query(query, [status]);
        return proposals;
    }

    // Pobieranie wszystkich propozycji (opcjonalnie filtrowanie po statusie)
    static async getAll({ status } = {}) {
        const query = status
            ? 'SELECT * FROM fuel_proposals WHERE status = ?'
            : 'SELECT * FROM fuel_proposals';
        const values = status ? [status] : [];
        const [proposals] = await db.query(query, values);
        return proposals;
    }

    // Pobieranie szczegółów jednej propozycji
    static async getById(proposalId) {
        const query = `
            SELECT * FROM fuel_proposals
            WHERE id = ?
        `;
        const [rows] = await db.query(query, [proposalId]);
        return rows[0]; 
    }

    // Pobieranie statystyk propozycji
    static async getStatistics() {
        const query = `
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected
            FROM fuel_proposals
        `;
        const [rows] = await db.query(query);
        return rows[0];
    }
}

module.exports = FuelProposal;
