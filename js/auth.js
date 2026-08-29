// /js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registro-form');
    const loginForm = document.getElementById('login-form');

    // La coordenada de tu servidor backend local
    const API_URL = 'http://127.0.0.1:3000/api';

    // =========================================
    // PROTOCOLO DE ALTA (Registro)
    // =========================================
    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Aborta la recarga por defecto del navegador

            // Extracción de evidencias de los inputs
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('reg-password').value;

            try {
                // Envío del paquete cifrado a la Fragua
                const response = await fetch(`${API_URL}/registro`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`[+] ÉXITO: ${data.mensaje}`);
                    registroForm.reset(); // Limpia la consola tras el éxito
                } else {
                    alert(`[-] BRECHA: ${data.error}`);
                }
            } catch (err) {
                console.error('Error de red:', err);
                alert('[-] ERROR CRÍTICO: Enlace con la Fragua perdido.');
            }
        });
    }

    // =========================================
    // PROTOCOLO DE IDENTIFICACIÓN (Login)
    // =========================================
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`[!] ACCESO CONCEDIDO: ${data.mensaje}`);
    
                    // Grabamos los datos completos del agente en la memoria persistente
                    localStorage.setItem('agente_sesion', JSON.stringify(data.user));
                    
                    // [NUEVO] Extraemos y grabamos el Nivel de Clearance explícitamente.
                    // Usamos un OR lógico por si en la base de datos la columna se llama clearance_level o level.
                    const clearance = data.user.clearance_level || data.user.level || 1;
                    localStorage.setItem('agente_level', clearance);
    
                    // Forzamos el salto hiperespacial al Laboratorio
                    window.location.href = 'laboratorio.html'; 
                } else {
                    alert(`[-] ACCESO DENEGADO: ${data.error}`);
                }
            } catch (err) {
                console.error('Error de red:', err);
                alert('[-] ERROR CRÍTICO: Enlace con la Fragua perdido.');
            }
        });
    }
});