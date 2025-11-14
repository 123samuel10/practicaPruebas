const participanteService = require('../services/participanteService');
const eventoService = require('../services/eventoService');
const { Participante, Evento } = require('../models');
const cache = require('memory-cache');

describe('Pruebas de Caché', () => {
  beforeEach(() => {
    // Limpiar el caché antes de cada prueba
    cache.clear();
  });

  describe('Caché de Participantes', () => {
    it('debería usar caché en llamadas consecutivas de listarParticipantes', async () => {
      // Crear un participante
      await Participante.create({
        nombre: 'Test User',
        correo: 'test@example.com',
        contraseña: 'password123'
      });

      // Primera llamada - debe consultar la BD
      const resultado1 = await participanteService.listarParticipantes();
      expect(resultado1).toHaveLength(1);

      // Eliminar el participante de la BD (sin invalidar caché)
      await Participante.destroy({ where: {}, force: true });

      // Segunda llamada - debe usar caché y seguir devolviendo el participante
      const resultado2 = await participanteService.listarParticipantes();
      expect(resultado2).toHaveLength(1);
      expect(resultado2).toEqual(resultado1);
    });

    it('debería invalidar caché al crear un nuevo participante', async () => {
      // Primera llamada - llenar caché vacío
      const resultado1 = await participanteService.listarParticipantes();
      expect(resultado1).toHaveLength(0);

      // Crear un participante (debería invalidar caché)
      await participanteService.crearParticipante({
        nombre: 'Nuevo Usuario',
        correo: 'nuevo@example.com',
        contraseña: 'password123'
      });

      // Segunda llamada - debe consultar BD de nuevo y traer el nuevo participante
      const resultado2 = await participanteService.listarParticipantes();
      expect(resultado2).toHaveLength(1);
      expect(resultado2[0].nombre).toBe('Nuevo Usuario');
    });

    it('debería cachear participantes individuales por ID', async () => {
      const participante = await Participante.create({
        nombre: 'Cache Test',
        correo: 'cache@example.com',
        contraseña: 'password123'
      });

      // Primera consulta - debe ir a la BD
      const resultado1 = await participanteService.obtenerParticipante(participante.id);
      expect(resultado1).toBeDefined();
      expect(resultado1.nombre).toBe('Cache Test');

      // Actualizar directamente en BD (sin usar el servicio)
      await Participante.update({ nombre: 'Nombre Actualizado' }, { where: { id: participante.id } });

      // Segunda consulta - debe usar caché y devolver el nombre viejo
      const resultado2 = await participanteService.obtenerParticipante(participante.id);
      expect(resultado2.nombre).toBe('Cache Test');
    });
  });

  describe('Caché de Eventos', () => {
    it('debería usar caché en llamadas consecutivas de listarEventos', async () => {
      // Crear un evento
      await Evento.create({
        titulo: 'Evento Test',
        descripcion: 'Descripción test',
        fecha: new Date('2025-12-01'),
        capacidad: 100
      });

      // Primera llamada - debe consultar la BD
      const resultado1 = await eventoService.listarEventos();
      expect(resultado1).toHaveLength(1);

      // Eliminar el evento de la BD (sin invalidar caché)
      await Evento.destroy({ where: {}, force: true });

      // Segunda llamada - debe usar caché y seguir devolviendo el evento
      const resultado2 = await eventoService.listarEventos();
      expect(resultado2).toHaveLength(1);
      expect(resultado2).toEqual(resultado1);
    });

    it('debería invalidar caché al crear un nuevo evento', async () => {
      // Primera llamada - llenar caché vacío
      const resultado1 = await eventoService.listarEventos();
      expect(resultado1).toHaveLength(0);

      // Crear un evento (debería invalidar caché)
      await eventoService.crearEvento({
        titulo: 'Nuevo Evento',
        descripcion: 'Descripción',
        fecha: new Date('2025-12-01'),
        capacidad: 50
      });

      // Segunda llamada - debe consultar BD de nuevo y traer el nuevo evento
      const resultado2 = await eventoService.listarEventos();
      expect(resultado2).toHaveLength(1);
      expect(resultado2[0].titulo).toBe('Nuevo Evento');
    });

    it('debería cachear eventos individuales por ID', async () => {
      const evento = await Evento.create({
        titulo: 'Cache Event',
        descripcion: 'Test',
        fecha: new Date('2025-12-01'),
        capacidad: 100
      });

      // Primera consulta - debe ir a la BD
      const resultado1 = await eventoService.obtenerEvento(evento.id);
      expect(resultado1).toBeDefined();
      expect(resultado1.titulo).toBe('Cache Event');

      // Actualizar directamente en BD (sin usar el servicio)
      await Evento.update({ titulo: 'Título Actualizado' }, { where: { id: evento.id } });

      // Segunda consulta - debe usar caché y devolver el título viejo
      const resultado2 = await eventoService.obtenerEvento(evento.id);
      expect(resultado2.titulo).toBe('Cache Event');
    });
  });
});
