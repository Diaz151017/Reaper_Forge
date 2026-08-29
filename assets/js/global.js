// /js/global.js
document.addEventListener('DOMContentLoaded', () => {
    const navAuth = document.querySelector('.nav-auth');
    const sesionActiva = localStorage.getItem('agente_sesion');

    // Si hay una sesión activa en la memoria del navegador...
    if (sesionActiva && navAuth) {
        const agente = JSON.parse(sesionActiva);
      
        // Mutamos el HTML del botón de Login por el nombre del agente y el botón de Salir
        navAuth.innerHTML = `
            <div class="perfil-menu-contenedor">
                <span class="agente-tag"> ${agente.username}</span>
                <button id="btn-logout" class="boton-logout">DESCONECTAR</button>
            </div>
        `;

        // Armamos el detonador de cierre de sesión
        document.getElementById('btn-logout').addEventListener('click', () => {
            localStorage.removeItem('agente_sesion'); // Purgamos la memoria
            alert('[!] Conexión terminada. Cerrando sesión...');
            window.location.href = 'index.html'; // Lo expulsamos a la pantalla de inicio
        });

        // =================================================
        // PROTOCOLO DEL HOMBRE MUERTO (DEAD MAN'S SWITCH)
        // =================================================
        
        let timeoutInactividad;
        
        // NOTA TÁCTICA PARA PRUEBAS: 
        // 10000 = 10 segundos. Cuando termines de probar, cámbialo a 300000 (5 minutos)
        const TIEMPO_LIMITE_MS = 1200000; 

        // Función de purga de emergencia
        const ejecutarExpulsion = () => {
            localStorage.removeItem('agente_sesion');
            alert('[-] PROTOCOLO HOMBRE MUERTO ACTIVADO: Ausencia de signos vitales en la terminal. Sesión purgada por seguridad.');
            window.location.href = 'index.html';
        };

        // Función para reiniciar el contador cada vez que haya actividad
        const resetearTemporizador = () => {
            clearTimeout(timeoutInactividad); // Detiene la cuenta atrás anterior
            timeoutInactividad = setTimeout(ejecutarExpulsion, TIEMPO_LIMITE_MS); // Inicia una nueva
        };

        // Activamos los sensores biométricos en todo el documento
        window.addEventListener('mousemove', resetearTemporizador);
        window.addEventListener('keydown', resetearTemporizador);
        window.addEventListener('click', resetearTemporizador);
        window.addEventListener('scroll', resetearTemporizador);

        // Arrancamos el contador por primera vez al cargar la página
        resetearTemporizador();
    }
});