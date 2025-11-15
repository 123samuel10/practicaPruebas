require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const eventosRoutes = require('./routes/eventos');
const participantesRoutes = require('./routes/participantes');
const asistenciasRoutes = require('./routes/asistencias');

app.use('/api/eventos', eventosRoutes);
app.use('/api/participantes', participantesRoutes);
app.use('/api/asistencias', asistenciasRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API Sistema de Gesti�n de Eventos',
    endpoints: {
      eventos: '/api/eventos',
      participantes: '/api/participantes',
      asistencias: '/api/asistencias'
    }
  });
});

// Sincronizar con la base de datos y arrancar el servidor solo si no estamos en entorno de pruebas
if (process.env.NODE_ENV !== 'test') {
  db.sequelize.sync()
    .then(() => {
      console.log('Base de datos conectada');
      app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('Error al conectar con la base de datos:', err);
    });
}

module.exports = app;
