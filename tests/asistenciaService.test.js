const asistenciaService = require('../services/asistenciaService');
const { Participante, Evento, Asistencia } = require('../models');

describe('AsistenciaService - Pruebas Unitarias', () => {
  let participante;
  let evento;

  beforeEach(async () => {
    // Crear un participante y evento de prueba antes de cada test
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

  describe('registrarAsistencia', () => {
    it('debería registrar una asistencia con datos válidos', async () => {
      const datos = {
        participante_id: participante.id,
        evento_id: evento.id
      };

      const resultado = await asistenciaService.registrarAsistencia(datos);

      expect(resultado).toBeDefined();
      expect(resultado.participante_id).toBe(participante.id);
      expect(resultado.evento_id).toBe(evento.id);
    });

    it('debería lanzar error si el participante no existe', async () => {
      const datos = {
        participante_id: 9999,
        evento_id: evento.id
      };

      await expect(asistenciaService.registrarAsistencia(datos))
        .rejects
        .toThrow('Participante no encontrado');
    });

    it('debería lanzar error si el evento no existe', async () => {
      const datos = {
        participante_id: participante.id,
        evento_id: 9999
      };

      await expect(asistenciaService.registrarAsistencia(datos))
        .rejects
        .toThrow('Evento no encontrado');
    });

    it('debería lanzar error si el participante ya está registrado en el evento', async () => {
      const datos = {
        participante_id: participante.id,
        evento_id: evento.id
      };

      await asistenciaService.registrarAsistencia(datos);

      await expect(asistenciaService.registrarAsistencia(datos))
        .rejects
        .toThrow('El participante ya está registrado en este evento.');
    });

  });

  describe('listarAsistencias', () => {
    it('debería retornar un array vacío si no hay asistencias', async () => {
      const resultado = await asistenciaService.listarAsistencias();
      expect(resultado).toEqual([]);
    });

    it('debería retornar todas las asistencias con sus relaciones', async () => {
      await Asistencia.create({
        participante_id: participante.id,
        evento_id: evento.id
      });

      const resultado = await asistenciaService.listarAsistencias();
      expect(resultado).toHaveLength(1);
      expect(resultado[0].participante).toBeDefined();
      expect(resultado[0].evento).toBeDefined();
      expect(resultado[0].participante.nombre).toBe('Juan Pérez');
      expect(resultado[0].evento.titulo).toBe('Conferencia Tech');
    });
  });

});
