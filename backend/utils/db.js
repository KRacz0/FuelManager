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
        station.fuel_diesel || null,
        station.fuel_gasoline || null,
        station.fuel_lpg || null
    ];
    try {
        const result = await pool.execute(query, values);
        return result[0];
    } catch (error) {
        console.error('Błąd podczas dodawania stacji:', error.message);
        throw error;
    }
}


async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        console.log('Połączono z bazą danych.');

        const usersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(usersTableQuery);
        console.log('Tabela "users" została sprawdzona lub utworzona.');

        const fuelStationsTableQuery = `
            CREATE TABLE IF NOT EXISTS fuel_stations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                brand ENUM('ORLEN', 'BP', 'SHELL', 'LOTOS', 'DP', 'PIEPRZYK') NOT NULL,
                address VARCHAR(255) NOT NULL,
                latitude DECIMAL(10, 8) NOT NULL,
                longitude DECIMAL(11, 8) NOT NULL,
                fuel_diesel DECIMAL(5, 2) DEFAULT NULL,
                fuel_gasoline DECIMAL(5, 2) DEFAULT NULL,
                fuel_lpg DECIMAL(5, 2) DEFAULT NULL,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        await connection.query(fuelStationsTableQuery);
        console.log('Tabela "fuel_stations" została sprawdzona lub utworzona.');

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
