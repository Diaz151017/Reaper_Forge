// /backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db'); // Importamos el pool de arriba

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares: Filtros obligatorios de interceptación
app.use(cors());
app.use(express.json());

// =========================================
// PROTOCOLO DE REGISTRO (Alta de Agentes)
// =========================================
app.post('/api/registro', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Verificación de integridad estructural: ¿Faltan datos?
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Faltan datos para completar el alta.' });
        }

        // 2. Blindaje de contraseña: Hash con Bcrypt
        // Generamos un hash con un factor de coste de 10
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Inserción parametrizada anti-Inyección SQL
        const query = 'INSERT INTO agentes (username, email, password_hash) VALUES (?, ?, ?)';
        await pool.query(query, [username, email, passwordHash]);

        console.log(`[+] Nuevo agente forjado: ${username}`);
        res.status(201).json({ mensaje: 'Agente registrado con éxito. Protocolo de alta completado.' });

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El identificador o email ya están en uso por otro agente.' });
        }
        console.error('[-] Error en registro:', err);
        res.status(500).json({ error: 'Error interno en la Fragua al procesar el alta.' });
    }
});

// =========================================
// PROTOCOLO DE ACCESO (Identificación)
// =========================================
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Localizar al agente
        const [rows] = await pool.query('SELECT * FROM agentes WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Identificación fallida. Credenciales no reconocidas.' });
        }

        const agente = rows[0];

        // 2. Confrontación de claves (Password vs Hash)
        const match = await bcrypt.compare(password, agente.password_hash);

        if (!match) {
            return res.status(401).json({ error: 'Identificación fallida. Credenciales no reconocidas.' });
        }

        // 3. Acceso concedido
        console.log(`[!] Acceso autorizado para: ${username} (Nivel ${agente.clearance_level})`);
        res.json({ 
            mensaje: `Bienvenido de nuevo, agente ${username}.`,
            user: { username: agente.username, level: agente.clearance_level }
        });

    } catch (err) {
        console.error('[-] Error en login:', err);
        res.status(500).json({ error: 'Error en el sistema de identificación.' });
    }
});

app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`[+] Núcleo de ReaperForge operativo en puerto ${PORT}`);
    console.log(`[+] Rutas de /api/registro y /api/login armadas.`);
    console.log(`=================================================\n`);
});

// =================================================
// RUTA API: OBTENER EXPEDIENTES DFIR (VERSIÓN ASÍNCRONA)
// =================================================
app.get('/api/incidentes', async (req, res) => {
    const query = 'SELECT * FROM incidentes ORDER BY nivel_requerido ASC, fecha_registro DESC';
    
    try {
        // En mysql2 con promesas, la consulta devuelve un array doble. 
        // [results] extrae directamente los datos y descarta los metadatos de las columnas.
        const [results] = await pool.query(query);
        
        // Enviamos los resultados al navegador
        res.json(results);
        
    } catch (error) {
        console.error('[-] Error extrayendo expedientes:', error);
        res.status(500).json({ error: 'Fallo de conexión con el núcleo de datos' });
    }
});

// =================================================
// RUTA API: METRICAS EN TIEMPO REAL PARA EL LAB
// =================================================
app.get('/api/incidentes/estadisticas', async (req, res) => {
    // Una sola consulta calcula el total y desglosa el semáforo
    const query = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN estado = 'purgado' THEN 1 ELSE 0 END) as purgados,
            SUM(CASE WHEN estado = 'en-curso' THEN 1 ELSE 0 END) as enCurso,
            SUM(CASE WHEN estado = 'comprometido' THEN 1 ELSE 0 END) as comprometidos
        FROM incidentes
    `;
    
    try {
        const [results] = await pool.query(query);
        // Devolvemos el primer (y único) registro del array
        res.json(results[0]);
    } catch (error) {
        console.error('[-] Error en la matriz de estadísticas:', error);
        res.status(500).json({ error: 'Fallo de telemetría en el núcleo' });
    }
});