const db = require('../utils/db');

class Station {
    static async getAll() {
        try {
            const query = 'SELECT * FROM fuel_stations';
            const rows = await db.query(query);
            return Array.isArray(rows) ? rows : [rows];
        } catch (error) {
            console.error('Błąd podczas pobierania stacji:', error.message);
            throw new Error('Nie udało się pobrać stacji z bazy danych.');
        }
    }

    static async add(stationData) {
        const query = `
            INSERT INTO fuel_stations (name, brand, address, latitude, longitude, fuel_diesel, fuel_gasoline, fuel_lpg)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            stationData.name,
            stationData.brand,
            stationData.address,
            stationData.latitude,
            stationData.longitude,
            stationData.fuel_diesel || null,
            stationData.fuel_gasoline || null,
            stationData.fuel_lpg || null,
        ];
        return await db.execute(query, values);
    }
}

module.exports = Station;
