const request = require('supertest');
const app = require('../index');

describe('Pruebas de Sistema - Flujo Completo de Gestión de Eventos', () => {
  let participanteId;
  let eventoId;

  describe('Flujo: Registro de participante, creación de evento y asistencia', () => {
    it('debería completar el flujo completo del sistema exitosamente', async () => {
      // 1. Crear un nuevo participante
      const nuevoParticipante = {
        nombre: 'Ana Martínez',
        correo: 'ana.martinez@example.com',
        contraseña: 'password123'
      };

      const responseParticipante = await request(app)
        .post('/api/participantes')
        .send(nuevoParticipante)
        .expect(201);

      expect(responseParticipante.body).toBeDefined();
      expect(responseParticipante.body.nombre).toBe(nuevoParticipante.nombre);
      expect(responseParticipante.body.correo).toBe(nuevoParticipante.correo);

      participanteId = responseParticipante.body.id;
      expect(participanteId).toBeDefined();

      // 2. Crear un nuevo evento
      const nuevoEvento = {
        titulo: 'Workshop de Node.js',
        descripcion: 'Taller práctico de desarrollo backend',
        fecha: new Date('2025-12-15'),
        ubicacion: 'Sala Virtual 1',
        capacidad: 50
      };

      const responseEvento = await request(app)
        .post('/api/eventos')
        .send(nuevoEvento)
        .expect(201);

      expect(responseEvento.body).toBeDefined();
      expect(responseEvento.body.titulo).toBe(nuevoEvento.titulo);
      expect(responseEvento.body.capacidad).toBe(nuevoEvento.capacidad);

      eventoId = responseEvento.body.id;
      expect(eventoId).toBeDefined();

      // 3. Registrar asistencia del participante al evento
      const nuevaAsistencia = {
        participante_id: participanteId,
        evento_id: eventoId
      };

      const responseAsistencia = await request(app)
        .post('/api/asistencias')
        .send(nuevaAsistencia)
        .expect(201);

      expect(responseAsistencia.body).toBeDefined();
      expect(responseAsistencia.body.participante_id).toBe(participanteId);
      expect(responseAsistencia.body.evento_id).toBe(eventoId);

      // 4. Verificar que el participante está en la lista de asistencias
      const responseListaAsistencias = await request(app)
        .get('/api/asistencias')
        .expect(200);

      expect(Array.isArray(responseListaAsistencias.body)).toBe(true);
      expect(responseListaAsistencias.body.length).toBeGreaterThan(0);

      const asistenciaEncontrada = responseListaAsistencias.body.find(
        a => a.participante_id === participanteId && a.evento_id === eventoId
      );

      expect(asistenciaEncontrada).toBeDefined();
      expect(asistenciaEncontrada.participante).toBeDefined();
      expect(asistenciaEncontrada.participante.nombre).toBe(nuevoParticipante.nombre);
      expect(asistenciaEncontrada.evento).toBeDefined();
      expect(asistenciaEncontrada.evento.titulo).toBe(nuevoEvento.titulo);

      // 5. Consultar el participante y verificar que existe
      const responseConsultaParticipante = await request(app)
        .get(`/api/participantes/${participanteId}`)
        .expect(200);

      expect(responseConsultaParticipante.body).toBeDefined();
      expect(responseConsultaParticipante.body.id).toBe(participanteId);
      expect(responseConsultaParticipante.body.nombre).toBe(nuevoParticipante.nombre);

      // 6. Consultar el evento y verificar que existe
      const responseConsultaEvento = await request(app)
        .get(`/api/eventos/${eventoId}`)
        .expect(200);

      expect(responseConsultaEvento.body).toBeDefined();
      expect(responseConsultaEvento.body.id).toBe(eventoId);
      expect(responseConsultaEvento.body.titulo).toBe(nuevoEvento.titulo);

      // 7. Intentar registrar la misma asistencia nuevamente (debería fallar)
      const responseDuplicada = await request(app)
        .post('/api/asistencias')
        .send(nuevaAsistencia)
        .expect(400);

      expect(responseDuplicada.body.error).toBeDefined();
      expect(responseDuplicada.body.error).toContain('ya está registrado');
    });
  });
});
