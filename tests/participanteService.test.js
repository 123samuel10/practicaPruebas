const participanteService = require('../services/participanteService');
const { Participante } = require('../models');

describe('ParticipanteService - Pruebas Unitarias', () => {
  describe('crearParticipante', () => {
    it('debería crear un participante con datos válidos', async () => {
      const datos = {
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        telefono: '1234567890',
        contraseña: 'password123'
      };

      const resultado = await participanteService.crearParticipante(datos);

      expect(resultado).toBeDefined();
      expect(resultado.nombre).toBe(datos.nombre);
      expect(resultado.correo).toBe(datos.correo);
      expect(resultado.telefono).toBe(datos.telefono);
    });

    it('debería lanzar error si falta el nombre', async () => {
      const datos = {
        correo: 'juan@example.com',
        contraseña: 'password123'
      };

      await expect(participanteService.crearParticipante(datos))
        .rejects
        .toThrow('El nombre y el correo son obligatorios.');
    });

    it('debería lanzar error si falta el correo', async () => {
      const datos = {
        nombre: 'Juan Pérez',
        contraseña: 'password123'
      };

      await expect(participanteService.crearParticipante(datos))
        .rejects
        .toThrow('El nombre y el correo son obligatorios.');
    });

    it('debería lanzar error si el correo ya existe', async () => {
      const datos = {
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'password123'
      };

      await participanteService.crearParticipante(datos);

      await expect(participanteService.crearParticipante(datos))
        .rejects
        .toThrow('Ya existe un participante con este correo.');
    });
  });

  describe('listarParticipantes', () => {
    it('debería retornar un array vacío si no hay participantes', async () => {
      const resultado = await participanteService.listarParticipantes();
      expect(resultado).toEqual([]);
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

      const resultado = await participanteService.listarParticipantes();
      expect(resultado).toHaveLength(2);
    });
  });

  describe('obtenerParticipante', () => {
    it('debería retornar un participante por su ID', async () => {
      const participante = await Participante.create({
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'password123'
      });

      const resultado = await participanteService.obtenerParticipante(participante.id);
      expect(resultado).toBeDefined();
      expect(resultado.nombre).toBe('Juan Pérez');
      expect(resultado.correo).toBe('juan@example.com');
    });

    it('debería retornar null si el participante no existe', async () => {
      const resultado = await participanteService.obtenerParticipante(9999);
      expect(resultado).toBeNull();
    });
  });

  describe('actualizarParticipante', () => {
    it('debería actualizar un participante existente', async () => {
      const participante = await Participante.create({
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'password123'
      });

      const resultado = await participanteService.actualizarParticipante(
        participante.id,
        { nombre: 'Juan Carlos Pérez' }
      );

      expect(resultado[0]).toBe(1); // 1 fila afectada

      const participanteActualizado = await Participante.findByPk(participante.id);
      expect(participanteActualizado.nombre).toBe('Juan Carlos Pérez');
    });

    it('debería retornar [0] si el participante no existe', async () => {
      const resultado = await participanteService.actualizarParticipante(9999, {
        nombre: 'Nuevo Nombre'
      });
      expect(resultado[0]).toBe(0);
    });
  });

  describe('eliminarParticipante', () => {
    it('debería eliminar un participante existente', async () => {
      const participante = await Participante.create({
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'password123'
      });

      const resultado = await participanteService.eliminarParticipante(participante.id);
      expect(resultado).toBe(1); // 1 fila eliminada

      const participanteEliminado = await Participante.findByPk(participante.id);
      expect(participanteEliminado).toBeNull();
    });

    it('debería retornar 0 si el participante no existe', async () => {
      const resultado = await participanteService.eliminarParticipante(9999);
      expect(resultado).toBe(0);
    });
  });
});
