# 🛡️ ReaperForge — Plataforma Táctica de Triaje DFIR y Análisis de Logs

> **Estado del proyecto:** Prototipo Funcional (v0.2 Alfa) — En transición a arquitectura Full Stack para Trabajo Final de Ciclo (DAW 2026/2027).

**ReaperForge** es una herramienta web orientada a equipos **Blue Team / DFIR (Digital Forensics and Incident Response)** y administradores de infraestructura crítica. Su objetivo es centralizar la ingesta de logs, agilizar la caza de amenazas (*Threat Hunting*) mediante filtrado avanzado y automatizar la generación de reportes de incidentes manteniendo la trazabilidad de las evidencias.

---

## ⚙️ Funcionalidades del Prototipo Actual (v0.2)

* **Motor de Triaje y Filtrado Regex (`autopsia-regex` / `laboratorio`):** Interfaz interactiva de inspección de eventos y logs de servidor con filtrado dinámico por códigos de estado y patrones de expresiones regulares.
* **Gestión de Estado de Incidentes (`backend/` & `js/`):** Lógica cliente-servidor en **Node.js** para el seguimiento de contadores de alertas, validación de hallazgos y registro de evidencias.
* **Interfaz de Operaciones (Modo Oscuro Táctico):** Diseño pensado para reducir la fatiga visual en sesiones prolongadas de monitorización.

---

## 🚀 Hoja de Ruta de Arquitectura (Curso 2026 - 2027)

El desarrollo actual se centra en escalar el prototipo hacia una herramienta de producción integrable en entornos científicos y de alta computación (HPC):

1. **Backend de Ingesta y Parseo Automatizado:** Implementación de API RESTful (Node.js/Express y scripts de preprocesamiento en Python) para la normalización de logs de sistema y red.
2. **Persistencia y Cadena de Custodia:** Base de datos relacional para el registro inmutable de evidencias (hashes SHA-256, líneas temporales de incidentes y control de accesos por rol).
3. **Generador Estándar de Reportes:** Exportación automatizada de informes técnicos y ejecutivos a partir de los artefactos marcados durante el triaje.

---

## 🛠️ Stack Tecnológico

* **Frontend:** HTML5 Semántico, CSS3 (Arquitectura modular), JavaScript ES6+.
* **Backend (En expansión):** Node.js, Express, Python (módulos de parseo).
* **Control de versiones:** Git / GitHub.

---
*Desarrollado por **Adrián Díaz García** `[T]`— Técnico Industrial (20 años exp. en sistemas críticos) y Desarrollador de Aplicaciones Web en formación (CIFP Pau Casesnoves).*
