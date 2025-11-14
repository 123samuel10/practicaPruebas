const asistenciaService = require("../services/asistenciaService");

module.exports = {
  async registrar(req, res) {
    try {
      const nuevaAsistencia = await asistenciaService.registrarAsistencia(req.body);
      res.status(201).json(nuevaAsistencia);
    } catch (error) {
      // Errores de negocio (cupo lleno, ya registrado) deben ser 400.
      res.status(400).json({ error: error.message });
    }
  },

  async listar(req, res) {
    try {
      const lista = await asistenciaService.listarAsistencias();
      res.status(200).json(lista);
    } catch (error) {
      res.status(500).json({ error: "Error al listar las asistencias." });
    }
  },

  async estadisticas(req, res) {
    try {
      const stats = await asistenciaService.obtenerEstadisticas();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las estadísticas." });
    }
  }
};
