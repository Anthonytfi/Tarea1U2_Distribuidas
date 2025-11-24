const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para entender JSON
app.use(express.json());

// Rutas (Aquí conectamos tus 3 archivos)
app.use('/equipo', require('./routes/equipo'));
app.use('/posicion', require('./routes/posicion'));
app.use('/jugador', require('./routes/jugador'));

// Mensaje de bienvenida en la ruta raíz (opcional, para probar que funciona)
app.get('/', (req, res) => {
    res.send("¡Liga de Fútbol puro chocolate!");
});

// Encender el servidor
app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto " + PORT);
    console.log("Conexión a MySQL lista.");
});