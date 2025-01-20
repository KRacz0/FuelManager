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
        const query = `
            SELECT 
                fp.id, 
                fp.station_id, 
                fs.name AS stationName, 
                fp.fuel_type AS fuelType, 
                fp.new_price AS newPrice, 
                fp.user_id, 
                fp.created_at, 
                fp.status, 
                fp.image_path
            FROM fuel_proposals fp
            LEFT JOIN fuel_stations fs ON fp.station_id = fs.id
            ${status ? 'WHERE fp.status = ?' : ''}
        `;
    
        const values = status ? [status] : [];
        const result = await db.query(query, values);
    
        if (!Array.isArray(result)) {
            return [result];
        }
    
        return result;
    }
    
// Pobieranie szczegółów jednej propozycji
static async getById(proposalId) {
    const proposalIdInt = parseInt(proposalId, 10);

    const query = `SELECT * FROM fuel_proposals WHERE id = ?`;
    const rows = await db.query(query, [proposalIdInt]);

    if (!Array.isArray(rows) || rows.length === 0) {
        return null;
    }

    console.log(`✅ Znaleziono propozycję:`, rows[0]);
    return rows[0];
}

    // Aktualizacja statusu propozycji
    static async updateProposalStatus(proposalId, status) {
        const proposalIdInt = parseInt(proposalId, 10);
    
        const proposal = await FuelProposal.getById(proposalIdInt);
        if (!proposal) {
            return false;
        }
    
        // Aktualizacja statusu propozycji
        const query = `UPDATE fuel_proposals SET status = ? WHERE id = ?`;
        const result = await db.query(query, [status, proposalIdInt]);
    
        if (result.affectedRows === 0) {
            return false;
        }
    
        console.log(`✅ Status propozycji ID ${proposalIdInt} zaktualizowany na "${status}"`);
    
        // Jeśli propozycja została zaakceptowana, aktualizujemy cenę paliwa na stacji
        if (status === 'approved') {
    
            let fuelColumn;
            switch (proposal.fuel_type) {
                case 'fuel_diesel':
                    fuelColumn = 'fuel_diesel';
                    break;
                case 'fuel_gasoline':
                    fuelColumn = 'fuel_gasoline';
                    break;
                case 'fuel_lpg':
                    fuelColumn = 'fuel_lpg';
                    break;
                default:
                    return false;
            }
    
            const updateStationQuery = `
                UPDATE fuel_stations 
                SET ${fuelColumn} = ?, last_updated = NOW()
                WHERE id = ?
            `;
    
            const updateResult = await db.query(updateStationQuery, [proposal.new_price, proposal.station_id]);
    
            if (updateResult.affectedRows === 0) {
                return false;
            }
    
            console.log(` Cena paliwa (${proposal.fuel_type}) na stacji ID ${proposal.station_id} została zaktualizowana do ${proposal.new_price} zł.`);
        }
    
        return true;
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
