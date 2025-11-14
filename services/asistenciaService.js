const { Asistencia, Evento, Participante } = require("../../models");
const cache = require("memory-cache");

const CACHE_KEY_ESTADISTICAS = "estadisticas_asistencias";
const CACHE_TTL = 10 * 1000; // 10 segundos

module.exports = {
  async registrarAsistencia({ participante_id, evento_id }) {
    // 1. Verificar que el participante y evento existan
    const participante = await Participante.findByPk(participante_id);
    if (!participante) throw new Error("Participante no encontrado");

    const evento = await Evento.findByPk(evento_id);
    if (!evento) throw new Error("Evento no encontrado");

    // 2. Evitar doble registro
    const yaRegistrado = await Asistencia.findOne({
      where: { participante_id, evento_id },
    });
    if (yaRegistrado) {
      throw new Error("El participante ya está registrado en este evento.");
    }

    // 3. Verificar capacidad del evento
    if (evento.capacidad) {
      const totalAsistentes = await Asistencia.count({ where: { evento_id } });
      if (totalAsistentes >= evento.capacidad) {
        throw new Error("El evento ha alcanzado su capacidad máxima.");
      }
    }

    // 4. Crear la asistencia
    const nuevaAsistencia = await Asistencia.create({ participante_id, evento_id });

    // 5. Invalidar el caché de estadísticas
    cache.del(CACHE_KEY_ESTADISTICAS);

    return nuevaAsistencia;
  },

  async listarAsistencias() {
    return Asistencia.findAll({
      include: [
        { model: Participante, as: "participante", attributes: ["id", "nombre", "correo"] },
        { model: Evento, as: "evento", attributes: ["id", "titulo", "fecha"] }
      ]
    });
  },

  async obtenerEstadisticas() {
    let stats = cache.get(CACHE_KEY_ESTADISTICAS);
    if (stats) return stats;

    stats = await Asistencia.findAll({
      attributes: ["evento_id", [Asistencia.sequelize.fn("COUNT", "id"), "total_participantes"]],
      group: ["evento_id"],
      include: [{ model: Evento, as: "evento", attributes: ["titulo", "capacidad"] }]
    });

    cache.put(CACHE_KEY_ESTADISTICAS, stats, CACHE_TTL);
    return stats;
  },
};