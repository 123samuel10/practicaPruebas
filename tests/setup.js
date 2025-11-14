// Configuración global para las pruebas
const { sequelize, Participante, Evento, Asistencia } = require('../models');
const cache = require('memory-cache');

beforeAll(async () => {
  // Sincronizar la base de datos antes de ejecutar las pruebas
  // force: true elimina y recrea las tablas
  // match: /_test$/ es una protección para asegurar que solo afecta bases de datos de prueba
  try {
    await sequelize.sync({ force: true, match: /_test$/ });
    console.log('Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    throw error;
  }
});

afterAll(async () => {
  // Cerrar la conexión después de las pruebas
  await sequelize.close();
});

// Limpiar la base de datos entre pruebas
afterEach(async () => {
  // Eliminar registros en el orden correcto (tablas dependientes primero)
  try {
    await Asistencia.destroy({ where: {}, force: true });
    await Participante.destroy({ where: {}, force: true });
    await Evento.destroy({ where: {}, force: true });
  } catch (error) {
    // Si hay error, intentar con truncate
    await sequelize.query('TRUNCATE TABLE asistencias, participantes, eventos RESTART IDENTITY CASCADE');
  }

  // Limpiar el caché después de cada prueba
  cache.clear();
});
