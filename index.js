const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fetch = require('node-fetch'); // Necesario para 'fetch' si Node.js < 18
const cron = require('node-cron');

// Esta es la URL de tu bot principal desplegado en Render (Servidor A)
// Se usará la variable de entorno MAIN_BOT_URL si está configurada en Render,
// de lo contrario, usará la URL que se proporciona aquí como fallback.
const MAIN_BOT_URL = process.env.MAIN_BOT_URL || 'https://botmine-jbn9.onrender.com/ping';

app.get('/', (req, res) => {
    res.send('Dummy server is awake! Pinging main bot...');
    // Cuando se accede a la raíz, también se envía un ping al principal
    pingMainBot();
});

// Este es el endpoint que el bot principal llamará a este dummy server
app.get('/dummy-ping', (req, res) => {
    console.log('[Dummy Server] Recibido ping del servidor principal.');
    res.status(200).send('Ping from main bot received!');
});

async function pingMainBot() {
    try {
        // Solo envía el ping si la URL no es el valor por defecto (para evitar pings a una URL genérica)
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
});

// Configurar el cron job para pingear el bot principal cada 10 minutos
// Esto es lo que mantiene el bot principal "despierto"
cron.schedule('*/10 * * * *', () => {
    console.log('[Dummy Server - Cron] Ejecutando ping al bot principal.');
    pingMainBot();
});
