const { Evento } = require("../models");
const cache = require("memory-cache");

const CACHE_KEY_EVENTOS = "lista_eventos";
const CACHE_KEY_EVENTO = "evento_";
const CACHE_TTL = 60 * 1000; // 60 segundos

module.exports = {
  /**
   * Crea un nuevo evento con validaciones de negocio.
   * @param {object} datosEvento - Los datos para el nuevo evento.
   * @returns {Promise<Evento>}
   */
  async crearEvento(datosEvento) {
    // Lógica de negocio: Ejemplo de validación
    if (!datosEvento.titulo || datosEvento.capacidad <= 0) {
      throw new Error("Datos del evento inválidos. El título es obligatorio y la capacidad debe ser mayor a 0.");
    }
    // Aquí podrías añadir más lógica, como evitar eventos duplicados.

    const nuevoEvento = await Evento.create(datosEvento);

    // Invalidar caché al crear un nuevo evento
    cache.del(CACHE_KEY_EVENTOS);

    return nuevoEvento;
  },

  async listarEventos() {
    // Verificar si existe en caché
    let eventos = cache.get(CACHE_KEY_EVENTOS);
    if (eventos) return eventos;

    // Si no existe en caché, consultar la BD
    eventos = await Evento.findAll();

    // Guardar en caché
    cache.put(CACHE_KEY_EVENTOS, eventos, CACHE_TTL);

    return eventos;
  },

  async obtenerEvento(id) {
    const cacheKey = CACHE_KEY_EVENTO + id;

    // Verificar si existe en caché
    let evento = cache.get(cacheKey);
    if (evento) return evento;

    // Si no existe en caché, consultar la BD
    evento = await Evento.findByPk(id);

    // Guardar en caché solo si se encontró
    if (evento) {
      cache.put(cacheKey, evento, CACHE_TTL);
    }

    return evento;
  },

  async actualizarEvento(id, datos) {
    // Primero, nos aseguramos de que el evento exista.
    const evento = await Evento.findByPk(id);
    if (!evento) return [0]; // Devuelve 0 filas afectadas si no se encuentra

    const resultado = await Evento.update(datos, { where: { id } });

    // Invalidar caché al actualizar
    cache.del(CACHE_KEY_EVENTOS);
    cache.del(CACHE_KEY_EVENTO + id);

    return resultado;
  },

  async eliminarEvento(id) {
    const resultado = await Evento.destroy({ where: { id } });

    // Invalidar caché al eliminar
    cache.del(CACHE_KEY_EVENTOS);
    cache.del(CACHE_KEY_EVENTO + id);

    return resultado;
  },
};