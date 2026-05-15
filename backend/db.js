// /backend/db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // Cargamos la bóveda de secretos directamente aquí

console.log(`[DIAGNÓSTICO POOL] Forjando conexión en ${process.env.DB_HOST}:3306 con el agente ${process.env.DB_USER}...`);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306, // El puerto estricto de la sonda
    connectTimeout: 5000, // Forzamos el impacto en 5 segundos máximo
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('>>> [OK] CONEXIÓN DEL POOL ESTABLECIDA. LA FRAGUA ESTÁ EN LÍNEA. Praise the Sun. [T]');
        connection.release();
    })
    .catch(err => {
        console.error('\n>>> [ERROR CRÍTICO DEL POOL]');
        console.error('Mensaje:', err.message);
        console.error('Código:', err.code);
    });

module.exports = pool;