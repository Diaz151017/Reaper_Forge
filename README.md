# ReaperForge 🛡️

**ReaperForge** es una consola web interactiva de alto rendimiento para el triage y la respuesta rápida ante incidentes (DFIR), diseñada para analistas de centros de operaciones de seguridad (SOC) e inspirada en entornos líderes de la industria como *CrowdStrike Falcon*.

La aplicación unifica la telemetría del sistema y la actividad de red en un entorno de trabajo optimizado para mitigar la fatiga de alertas y acelerar el tiempo de respuesta (MTTR).

---

## ⚡ Características Clave

*   **Espacio de Trabajo Unificado (Three-Pane Layout):** Interfaz confinada al Viewport (`100vh`) con scrolls independientes que consolida en una sola pantalla el árbol de procesos (EDR), el filtrado de red (NDR) y el cuaderno de evidencias forenses, eliminando el desgaste por cambio de contexto.
*   **Motor de Filtrado Algorítmico (Regex Engine):** Consola para ejecutar expresiones regulares en tiempo real sobre volcados masivos de logs, aislando indicadores de compromiso instantáneamente.
*   **Control de Acceso de Alta Seguridad (RBAC):** Sistema de control de acceso basado en roles que restringe las acciones tácticas o incidentes críticos según el nivel de autorización del agente.
*   **Cadena de Custodia Criptográfica:** Generación automática de firmas SHA-256 inmutables de las evidencias recolectadas para garantizar su integridad ante auditorías legales.
*   **Mitigación Activa:** Capacidad de aislar hosts comprometidos de la red con un solo clic de forma asíncrona mediante peticiones no bloqueantes.

---

## 🛠️ Stack Tecnológico

*   **Backend:** Node.js, Express.js
*   **Base de Datos Relacional:** MySQL (conector `mysql2/promise`)
*   **Frontend:** HTML5, CSS3 (CSS Grid & Flexbox), Vanilla JavaScript (Reactividad basada en eventos)