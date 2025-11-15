const request = require('supertest');
const app = require('../index');
const { Participante } = require('../models');

describe('API Participantes - Pruebas de Integración', () => {
  describe('POST /api/participantes', () => {
    it('debería crear un nuevo participante', async () => {
      const nuevoParticipante = {
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        telefono: '1234567890',
        contraseña: 'password123'
      };

      const response = await request(app)
        .post('/api/participantes')
        .send(nuevoParticipante)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.nombre).toBe(nuevoParticipante.nombre);
      expect(response.body.correo).toBe(nuevoParticipante.correo);
    });

    it('debería retornar 400 si faltan datos obligatorios', async () => {
      const datosIncompletos = {
        correo: 'juan@example.com'
      };

      const response = await request(app)
        .post('/api/participantes')
        .send(datosIncompletos)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('debería retornar 400 si el correo ya existe', async () => {
      const participante = {
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'password123'
      };

      await request(app)
        .post('/api/participantes')
        .send(participante)
        .expect(201);

      const response = await request(app)
        .post('/api/participantes')
        .send(participante)
        .expect(400);

      expect(response.body.error.toLowerCase()).toContain('ya existe');
    });
  });

  describe('GET /api/participantes', () => {
    it('debería retornar un array vacío si no hay participantes', async () => {
      const response = await request(app)
        .get('/api/participantes')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('debería retornar todos los participantes', async () => {
      await Participante.create({
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'password123'
      });
      await Participante.create({
        nombre: 'María García',
        correo: 'maria@example.com',
        contraseña: 'password123'
      });

      const response = await request(app)
        .get('/api/participantes')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/participantes/:id', () => {
    it('debería retornar un participante por su ID', async () => {
      const participante = await Participante.create({
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'password123'
      });

      const response = await request(app)
        .get(`/api/participantes/${participante.id}`)
        .expect(200);

      expect(response.body.nombre).toBe('Juan Pérez');
      expect(response.body.correo).toBe('juan@example.com');
    });

    it('debería retornar 404 si el participante no existe', async () => {
      const response = await request(app)
        .get('/api/participantes/9999')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/participantes/:id', () => {
    it('debería actualizar un participante existente', async () => {
      const participante = await Participante.create({
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'password123'
      });

      const datosActualizados = {
        nombre: 'Juan Carlos Pérez',
        telefono: '9876543210'
      };

      const response = await request(app)
        .put(`/api/participantes/${participante.id}`)
        .send(datosActualizados)
        .expect(200);

      expect(response.body.message).toBeDefined();

      const participanteActualizado = await Participante.findByPk(participante.id);
      expect(participanteActualizado.nombre).toBe(datosActualizados.nombre);
      expect(participanteActualizado.telefono).toBe(datosActualizados.telefono);
    });

    it('debería retornar 404 si el participante no existe', async () => {
      const response = await request(app)
        .put('/api/participantes/9999')
        .send({ nombre: 'Nuevo Nombre' })
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /api/participantes/:id', () => {
    it('debería eliminar un participante existente', async () => {
      const participante = await Participante.create({
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'password123'
      });

      const response = await request(app)
        .delete(`/api/participantes/${participante.id}`)
        .expect(200);

      expect(response.body.message).toBeDefined();

      const participanteEliminado = await Participante.findByPk(participante.id);
      expect(participanteEliminado).toBeNull();
    });

    it('debería retornar 404 si el participante no existe', async () => {
      const response = await request(app)
        .delete('/api/participantes/9999')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });
});
