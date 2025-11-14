const { Participante, Asistencia } = require("../models");
const cache = require("memory-cache");

const CACHE_KEY_PARTICIPANTES = "lista_participantes";
const CACHE_KEY_PARTICIPANTE = "participante_";
const CACHE_TTL = 60 * 1000; // 60 segundos

module.exports = {
  async crearParticipante(datos) {
    // Lógica de negocio: Validar que el correo sea único
    if (!datos.nombre || !datos.correo) {
      throw new Error("El nombre y el correo son obligatorios.");
    }

    const existente = await Participante.findOne({ where: { correo: datos.correo } });
    if (existente) {
      throw new Error("Ya existe un participante con este correo.");
    }

    const nuevoParticipante = await Participante.create(datos);

    // Invalidar caché al crear un nuevo participante
    cache.del(CACHE_KEY_PARTICIPANTES);

    return nuevoParticipante;
  },

  async listarParticipantes() {
    // Verificar si existe en caché
    let participantes = cache.get(CACHE_KEY_PARTICIPANTES);
    if (participantes) return participantes;

    // Si no existe en caché, consultar la BD
    participantes = await Participante.findAll({
      include: [{ model: Asistencia, as: "asistencias" }]
    });

    // Guardar en caché
    cache.put(CACHE_KEY_PARTICIPANTES, participantes, CACHE_TTL);

    return participantes;
  },

  async obtenerParticipante(id) {
    const cacheKey = CACHE_KEY_PARTICIPANTE + id;

    // Verificar si existe en caché
    let participante = cache.get(cacheKey);
    if (participante) return participante;

    // Si no existe en caché, consultar la BD
    participante = await Participante.findByPk(id, {
      include: [{ model: Asistencia, as: "asistencias" }]
    });

    // Guardar en caché solo si se encontró
    if (participante) {
      cache.put(cacheKey, participante, CACHE_TTL);
    }

    return participante;
  },

  async actualizarParticipante(id, datos) {
    const participante = await Participante.findByPk(id);
    if (!participante) return [0];

    const resultado = await Participante.update(datos, { where: { id } });

    // Invalidar caché al actualizar
    cache.del(CACHE_KEY_PARTICIPANTES);
    cache.del(CACHE_KEY_PARTICIPANTE + id);

    return resultado;
  },

  async eliminarParticipante(id) {
    const resultado = await Participante.destroy({ where: { id } });

    // Invalidar caché al eliminar
    cache.del(CACHE_KEY_PARTICIPANTES);
    cache.del(CACHE_KEY_PARTICIPANTE + id);

    return resultado;
  },
};