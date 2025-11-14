const request = require('supertest');
const app = require('../index');
const { Participante, Evento, Asistencia } = require('../models');

describe('API Asistencias - Pruebas de Integración', () => {
  let participante;
  let evento;

  beforeEach(async () => {
    participante = await Participante.create({
      nombre: 'Juan Pérez',
      correo: 'juan@example.com',
      contraseña: 'password123'
    });

    evento = await Evento.create({
      titulo: 'Conferencia Tech',
      fecha: new Date('2025-12-01'),
      capacidad: 100
    });
  });

  describe('POST /api/asistencias', () => {
    it('debería registrar una nueva asistencia', async () => {
      const nuevaAsistencia = {
        participante_id: participante.id,
        evento_id: evento.id
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(nuevaAsistencia)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.participante_id).toBe(participante.id);
      expect(response.body.evento_id).toBe(evento.id);
    });

    it('debería retornar 400 si el participante no existe', async () => {
      const asistenciaInvalida = {
        participante_id: 9999,
        evento_id: evento.id
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaInvalida)
        .expect(400);

      expect(response.body.error).toContain('no encontrado');
    });

    it('debería retornar 400 si el evento no existe', async () => {
      const asistenciaInvalida = {
        participante_id: participante.id,
        evento_id: 9999
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaInvalida)
        .expect(400);

      expect(response.body.error).toContain('no encontrado');
    });

    it('debería retornar 400 si el participante ya está registrado', async () => {
      const asistencia = {
        participante_id: participante.id,
        evento_id: evento.id
      };

      await request(app)
        .post('/api/asistencias')
        .send(asistencia)
        .expect(201);

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistencia)
        .expect(400);

      expect(response.body.error).toContain('ya está registrado');
    });

  });

  describe('GET /api/asistencias', () => {
    it('debería retornar un array vacío si no hay asistencias', async () => {
      const response = await request(app)
        .get('/api/asistencias')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('debería retornar todas las asistencias con relaciones', async () => {
      await Asistencia.create({
        participante_id: participante.id,
        evento_id: evento.id
      });

      const response = await request(app)
        .get('/api/asistencias')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].participante).toBeDefined();
      expect(response.body[0].evento).toBeDefined();
      expect(response.body[0].participante.nombre).toBe('Juan Pérez');
      expect(response.body[0].evento.titulo).toBe('Conferencia Tech');
    });
  });

});
