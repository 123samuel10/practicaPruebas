const request = require('supertest');
const app = require('../index');
const { Evento } = require('../models');

describe('API Eventos - Pruebas de Integración', () => {
  describe('POST /api/eventos', () => {
    it('debería crear un nuevo evento', async () => {
      const nuevoEvento = {
        titulo: 'Conferencia de Tecnología',
        descripcion: 'Una conferencia sobre tecnología',
        fecha: '2025-12-01',
        ubicacion: 'Centro de Convenciones',
        capacidad: 100
      };

      const response = await request(app)
        .post('/api/eventos')
        .send(nuevoEvento)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.titulo).toBe(nuevoEvento.titulo);
      expect(response.body.capacidad).toBe(nuevoEvento.capacidad);
    });

    it('debería retornar 400 si faltan datos obligatorios', async () => {
      const datosIncompletos = {
        descripcion: 'Una conferencia'
      };

      const response = await request(app)
        .post('/api/eventos')
        .send(datosIncompletos)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('debería retornar 400 si la capacidad es inválida', async () => {
      const eventoInvalido = {
        titulo: 'Conferencia',
        fecha: '2025-12-01',
        capacidad: -10
      };

      const response = await request(app)
        .post('/api/eventos')
        .send(eventoInvalido)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/eventos', () => {
    it('debería retornar un array vacío si no hay eventos', async () => {
      const response = await request(app)
        .get('/api/eventos')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('debería retornar todos los eventos', async () => {
      await Evento.create({
        titulo: 'Evento 1',
        fecha: new Date('2025-12-01'),
        capacidad: 50
      });
      await Evento.create({
        titulo: 'Evento 2',
        fecha: new Date('2025-12-15'),
        capacidad: 100
      });

      const response = await request(app)
        .get('/api/eventos')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/eventos/:id', () => {
    it('debería retornar un evento por su ID', async () => {
      const evento = await Evento.create({
        titulo: 'Conferencia Tech',
        fecha: new Date('2025-12-01'),
        ubicacion: 'Centro de Convenciones',
        capacidad: 100
      });

      const response = await request(app)
        .get(`/api/eventos/${evento.id}`)
        .expect(200);

      expect(response.body.titulo).toBe('Conferencia Tech');
      expect(response.body.capacidad).toBe(100);
    });

    it('debería retornar 404 si el evento no existe', async () => {
      const response = await request(app)
        .get('/api/eventos/9999')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/eventos/:id', () => {
    it('debería actualizar un evento existente', async () => {
      const evento = await Evento.create({
        titulo: 'Conferencia Tech',
        fecha: new Date('2025-12-01'),
        capacidad: 100
      });

      const datosActualizados = {
        titulo: 'Conferencia Tech 2025',
        capacidad: 150
      };

      const response = await request(app)
        .put(`/api/eventos/${evento.id}`)
        .send(datosActualizados)
        .expect(200);

      expect(response.body.message).toBeDefined();

      const eventoActualizado = await Evento.findByPk(evento.id);
      expect(eventoActualizado.titulo).toBe(datosActualizados.titulo);
      expect(eventoActualizado.capacidad).toBe(datosActualizados.capacidad);
    });

    it('debería retornar 404 si el evento no existe', async () => {
      const response = await request(app)
        .put('/api/eventos/9999')
        .send({ titulo: 'Nuevo Título' })
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /api/eventos/:id', () => {
    it('debería eliminar un evento existente', async () => {
      const evento = await Evento.create({
        titulo: 'Conferencia Tech',
        fecha: new Date('2025-12-01'),
        capacidad: 100
      });

      const response = await request(app)
        .delete(`/api/eventos/${evento.id}`)
        .expect(200);

      expect(response.body.message).toBeDefined();

      const eventoEliminado = await Evento.findByPk(evento.id);
      expect(eventoEliminado).toBeNull();
    });

    it('debería retornar 404 si el evento no existe', async () => {
      const response = await request(app)
        .delete('/api/eventos/9999')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });
});
