const { Asistencia, Evento, Participante } = require("../models");
const cache = require("memory-cache");

const CACHE_KEY_ESTADISTICAS = "estadisticas_asistencias";
const CACHE_TTL = 10 * 1000; // 10 segundos (ajustable)

module.exports = {
  // Registrar asistencia con verificación de capacidad
  async registrar(req, res) {
    try {
      const { participante_id, evento_id } = req.body;

      // Verificar que el participante y evento existan
      const participante = await Participante.findByPk(participante_id);
      const evento = await Evento.findByPk(evento_id);
      if (!participante) return res.status(404).json({ error: "Participante no encontrado" });
      if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

      // Verificar capacidad (opcional: agregar un campo 'capacidad' en eventos)
      if (evento.capacidad) {
        const totalAsistentes = await Asistencia.count({ where: { evento_id } });
        if (totalAsistentes >= evento.capacidad) {
          return res.status(400).json({ error: "Evento lleno, no se puede registrar más participantes" });
        }
      }

      // Crear asistencia
      const nueva = await Asistencia.create({ participante_id, evento_id });

      // Limpiar cache de estadísticas al registrar
      cache.del(CACHE_KEY_ESTADISTICAS);

      res.json(nueva);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Listar todas las asistencias (con cache)
  async listar(req, res) {
    try {
      const lista = await Asistencia.findAll({
        include: [
          { model: Participante, as: "participante", attributes: ["id", "nombre", "correo"] },
          { model: Evento, as: "evento", attributes: ["id", "titulo", "fecha"] }
        ]
      });
      res.json(lista);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obtener estadísticas por evento (con cache)
  async estadisticas(req, res) {
    try {
      let stats = cache.get(CACHE_KEY_ESTADISTICAS);

      if (!stats) {
        stats = await Asistencia.findAll({
          attributes: ["evento_id", [Asistencia.sequelize.fn("COUNT", "id"), "total_participantes"]],
          group: ["evento_id"],
          include: [{ model: Evento, as: "evento", attributes: ["titulo"] }]
        });

        cache.put(CACHE_KEY_ESTADISTICAS, stats, CACHE_TTL);
      }

      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
