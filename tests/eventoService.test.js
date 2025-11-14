const eventoService = require('../services/eventoService');
const { Evento } = require('../models');

describe('EventoService - Pruebas Unitarias', () => {
  describe('crearEvento', () => {
    it('debería crear un evento con datos válidos', async () => {
      const datos = {
        titulo: 'Conferencia de Tecnología',
        descripcion: 'Una conferencia sobre las últimas tendencias en tecnología',
        fecha: new Date('2025-12-01'),
        ubicacion: 'Centro de Convenciones',
        capacidad: 100
      };

      const resultado = await eventoService.crearEvento(datos);

      expect(resultado).toBeDefined();
      expect(resultado.titulo).toBe(datos.titulo);
      expect(resultado.capacidad).toBe(datos.capacidad);
      expect(resultado.ubicacion).toBe(datos.ubicacion);
    });

    it('debería lanzar error si falta el título', async () => {
      const datos = {
        descripcion: 'Una conferencia',
        fecha: new Date('2025-12-01'),
        capacidad: 100
      };

      await expect(eventoService.crearEvento(datos))
        .rejects
        .toThrow('Datos del evento inválidos');
    });

    it('debería lanzar error si la capacidad es 0 o negativa', async () => {
      const datos = {
        titulo: 'Conferencia',
        fecha: new Date('2025-12-01'),
        capacidad: 0
      };

      await expect(eventoService.crearEvento(datos))
        .rejects
        .toThrow('Datos del evento inválidos');
    });

    it('debería lanzar error si la capacidad es negativa', async () => {
      const datos = {
        titulo: 'Conferencia',
        fecha: new Date('2025-12-01'),
        capacidad: -10
      };

      await expect(eventoService.crearEvento(datos))
        .rejects
        .toThrow('Datos del evento inválidos');
    });
  });

  describe('listarEventos', () => {
    it('debería retornar un array vacío si no hay eventos', async () => {
      const resultado = await eventoService.listarEventos();
      expect(resultado).toEqual([]);
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

      const resultado = await eventoService.listarEventos();
      expect(resultado).toHaveLength(2);
    });
  });

  describe('obtenerEvento', () => {
    it('debería retornar un evento por su ID', async () => {
      const evento = await Evento.create({
        titulo: 'Conferencia Tech',
        fecha: new Date('2025-12-01'),
        ubicacion: 'Centro de Convenciones',
        capacidad: 100
      });

      const resultado = await eventoService.obtenerEvento(evento.id);
      expect(resultado).toBeDefined();
      expect(resultado.titulo).toBe('Conferencia Tech');
      expect(resultado.capacidad).toBe(100);
    });

    it('debería retornar null si el evento no existe', async () => {
      const resultado = await eventoService.obtenerEvento(9999);
      expect(resultado).toBeNull();
    });
  });

  describe('actualizarEvento', () => {
    it('debería actualizar un evento existente', async () => {
      const evento = await Evento.create({
        titulo: 'Conferencia Tech',
        fecha: new Date('2025-12-01'),
        capacidad: 100
      });

      const resultado = await eventoService.actualizarEvento(
        evento.id,
        { titulo: 'Conferencia Tech 2025', capacidad: 150 }
      );

      expect(resultado[0]).toBe(1); // 1 fila afectada

      const eventoActualizado = await Evento.findByPk(evento.id);
      expect(eventoActualizado.titulo).toBe('Conferencia Tech 2025');
      expect(eventoActualizado.capacidad).toBe(150);
    });

    it('debería retornar [0] si el evento no existe', async () => {
      const resultado = await eventoService.actualizarEvento(9999, {
        titulo: 'Nuevo Título'
      });
      expect(resultado[0]).toBe(0);
    });
  });

  describe('eliminarEvento', () => {
    it('debería eliminar un evento existente', async () => {
      const evento = await Evento.create({
        titulo: 'Conferencia Tech',
        fecha: new Date('2025-12-01'),
        capacidad: 100
      });

      const resultado = await eventoService.eliminarEvento(evento.id);
      expect(resultado).toBe(1); // 1 fila eliminada

      const eventoEliminado = await Evento.findByPk(evento.id);
      expect(eventoEliminado).toBeNull();
    });

    it('debería retornar 0 si el evento no existe', async () => {
      const resultado = await eventoService.eliminarEvento(9999);
      expect(resultado).toBe(0);
    });
  });
});
