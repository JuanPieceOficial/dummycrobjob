const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Render asigna el puerto automáticamente

// Esta es la URL de tu bot principal desplegado en Render (Servidor A)
// DEBES REEMPLAZAR ESTO CON LA URL REAL DE TU BOT PRINCIPAL
const MAIN_BOT_URL = process.env.MAIN_BOT_URL || 'https://tu-bot-principal.onrender.com/ping'; // Ejemplo: /ping es el endpoint que crearás en el bot principal

app.get('/', (req, res) => {
    res.send('Dummy server is awake! Pinging main bot...');
    // Llama al bot principal para mantenerlo despierto
    pingMainBot();
});

app.get('/dummy-ping', (req, res) => {
    // Este es el endpoint que el bot principal llamará a este dummy server
    console.log('[Dummy Server] Recibido ping del servidor principal.');
    res.status(200).send('Ping from main bot received!');
});

async function pingMainBot() {
    try {
        if (MAIN_BOT_URL && MAIN_BOT_URL !== 'https://tu-bot-principal.onrender.com/ping') {
            console.log(`[Dummy Server] Enviando ping a: ${MAIN_BOT_URL}`);
            const response = await fetch(MAIN_BOT_URL, { method: 'GET' });
            if (response.ok) {
                console.log('[Dummy Server] Ping exitoso al bot principal.');
            } else {
                console.error(`[Dummy Server] Error al pingear el bot principal: ${response.status} ${response.statusText}`);
            }
        } else {
            console.warn('[Dummy Server] MAIN_BOT_URL no configurada o es el valor por defecto. No se enviará ping.');
        }
    } catch (error) {
        console.error('[Dummy Server] Error en la función pingMainBot:', error.message);
    }
}

app.listen(PORT, () => {
    console.log(`Dummy server escuchando en el puerto ${PORT}`);
    // Opcional: Iniciar el primer ping al bot principal después de un retraso
    // setInterval(pingMainBot, 10 * 60 * 1000); // Ping cada 10 minutos
    // Mejor usar un cron job interno si el servicio puede dormir.
});

// Implementación del cron job interno para asegurar el ping
const cron = require('node-cron');
// Ping cada 10 minutos. Ajusta si los 15 minutos de inactividad de Render son muy estrictos.
cron.schedule('*/10 * * * *', () => {
    console.log('[Dummy Server - Cron] Ejecutando ping al bot principal.');
    pingMainBot();
});
