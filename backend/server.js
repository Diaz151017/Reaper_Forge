// /backend/server.js
require('dotenv').config(); // Cargamos los secretos de la bóveda
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Invocamos la conexión a MySQL que creaste antes

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares (Los protocolos de seguridad básica)
app.use(cors()); // Permite que tu HTML se comunique con este servidor sin bloqueos
app.use(express.json()); // Instruye al servidor para que sepa leer datos en formato JSON

// Ruta de diagnóstico
app.get('/api/status', (req, res) => {
    res.json({ 
        estado: 'Operativo', 
        mensaje: 'Servidor de la Fragua en línea. Blue Team a la espera.' 
    });
});

// Secuencia de ignición
app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`[+] Módulo Express iniciado en el puerto ${PORT}`);
    console.log(`[+] Esperando confirmación de la base de datos...`);
    console.log(`=================================================\n`);
});