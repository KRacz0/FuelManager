const mysql = require('mysql2/promise');
const config = require('../config/config');

const pool = mysql.createPool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

async function getAllStations() {
    const query = 'SELECT * FROM fuel_stations';
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Błąd podczas pobierania stacji z bazy:', error.message);
        throw error;
    }
}


async function addStation(station) {
    const query = `
        INSERT INTO fuel_stations (name, brand, address, latitude, longitude, fuel_diesel, fuel_gasoline, fuel_lpg)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        station.name,
        station.brand,
        station.address,
        station.latitude,
        station.longitude,
        station.fuel_diesel,
        station.fuel_gasoline,
        station.fuel_lpg
    ];
    return await db.execute(query, values);
}

async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        console.log('Połączono z bazą danych.');

        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(query);
        console.log('Tabela "users" została sprawdzona lub utworzona.');
        connection.release();
    } catch (error) {
        console.error('Błąd podczas inicjalizacji bazy danych:', error.message);
        console.error('Szczegóły błędu:', error);
    }
}

initializeDatabase();

module.exports = {
    query: async (...args) => {
        try {
            const [rows] = await pool.query(...args);
            console.log('Query executed successfully:', rows);
            return rows;
        } catch (error) {
            console.error('Błąd podczas wykonywania zapytania:', error.message);
            console.error('Szczegóły błędu:', error);
            throw error;
        }
    },
    execute: async (...args) => {
        try {
            const result = await pool.execute(...args);
            console.log('Execute executed successfully:', result);
            return result[0];
        } catch (error) {
            console.error('Błąd podczas wykonywania zapytania:', error.message);
            console.error('Szczegóły błędu:', error);
            throw error;
        }
    },
    getAllStations,
    addStation,     
};
