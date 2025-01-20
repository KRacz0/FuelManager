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

module.exports = {
    query: async (query, params) => {
        try {
            const [rows] = await pool.query(query, params);
            if (!Array.isArray(rows)) {
                console.error('Wynik zapytania SQL nie jest tablicą!', rows);
                return [];
            }
            return rows;
        } catch (error) {
            console.error('Błąd w query:', error.message);
            throw error;
        }
    },
    execute: async (query, params) => {
        try {
            const [result] = await pool.execute(query, params);
            return result;
        } catch (error) {
            console.error('Błąd w execute:', error.message);
            throw error;
        }
    },
    initializeDatabase: async () => {
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

            const fuelProposalsTableQuery = `
                CREATE TABLE IF NOT EXISTS fuel_proposals (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    station_id INT NOT NULL,
                    fuel_type ENUM('fuel_diesel', 'fuel_gasoline', 'fuel_lpg') NOT NULL,
                    new_price DECIMAL(5, 2) NOT NULL,
                    user_id INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                    FOREIGN KEY (station_id) REFERENCES fuel_stations(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `;
            await connection.query(fuelProposalsTableQuery);


            connection.release();
            console.log('Tabele zostały zainicjalizowane.');
        } catch (error) {
            console.error('Błąd podczas inicjalizacji bazy danych:', error.message);
            throw error;
        }
    },
};
