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
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos para completar el alta.' });
    }

    // Hash de Bcrypt con 10 salt rounds (Estable)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Modificamos la query para asignar dinámicamente rol_id = 1 (Triage Analyst L1) por defecto
    const query = 'INSERT INTO agentes (username, email, password_hash, rol_id) VALUES (?, ?, ?, 1)';
    await pool.query(query, [username, email, passwordHash]);

    console.log(`[+] Nuevo agente de campo registrado: ${username} (Asignado L1 Triage)`);
    res.status(201).json({ mensaje: 'Agente registrado con éxito. Asignado nivel de acceso L1 Triage.' });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El identificador o email ya están en uso.' });
    }
    console.error('[-] Error en registro:', err);
    res.status(500).json({ error: 'Error interno en la Fragua al procesar el alta.' });
  }
});

// =========================================
// PROTOCOLO DE ACCESO (Identificación Optimizado para Roles SOC)
// =========================================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // 1. Localizar al agente uniendo con su rol mediante INNER JOIN
    const query = `
      SELECT a.*, r.nombre AS rol_nombre, r.clearance_level 
      FROM agentes a
      INNER JOIN roles r ON a.rol_id = r.id
      WHERE a.username = ?
    `;
    const [rows] = await pool.query(query, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Identificación fallida. Credenciales no reconocidas.' });
    }

    const agente = rows[0];

    // 2. Confrontación de claves (Password vs Hash real Bcrypt)
    const match = await bcrypt.compare(password, agente.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Identificación fallida. Credenciales no reconocidas.' });
    }

    // 3. Acceso concedido (Devolvemos tanto el nivel numérico como el nombre del Rol real)
    console.log(`[!] Acceso autorizado para: ${username} (Rol: ${agente.rol_nombre} // Clearance Lvl: ${agente.clearance_level})`);
    
    res.json({
      mensaje: `Bienvenido al centro de operaciones, agente ${username}.`,
      user: {
        username: agente.username,
        level: agente.clearance_level, // Sigue mapeándose con data.user.level en tu auth.js
        rol: agente.rol_nombre         // Nuevo campo para pintar el nombre técnico en tu perfil
      }
    });

  } catch (err) {
    console.error('[-] Error en login:', err);
    res.status(500).json({ error: 'Error en el sistema de identificación.' });
  }
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

// =================================================
// RUTA API: ACTUALIZAR ESTADO DE UN INCIDENTE (PURGAR)
// =================================================
app.put('/api/incidentes/:id/purgar', async (req, res) => {
    const { id } = req.params; // Capturamos el ID enviado en la URL
    const query = "UPDATE incidentes SET estado = 'purgado' WHERE id = ?";

    try {
        const [result] = await pool.query(query, [id]);
        
        // Verificamos si el incidente realmente existía
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'El expediente especificado no existe.' });
        }

        res.json({ mensaje: `[+] Registro de seguridad actualizado. Incidente ${id} purgado.` });
    } catch (error) {
        console.error('[-] Error al ejecutar el veredicto en la base de datos:', error);
        res.status(500).json({ error: 'Fallo crítico en el sistema de actualización.' });
    }
});