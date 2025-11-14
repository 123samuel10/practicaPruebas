const participanteService = require("../services/participanteService");

module.exports = {
  async crear(req, res) {
    try {
      const nuevo = await participanteService.crearParticipante(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listar(req, res) {
    try {
      const lista = await participanteService.listarParticipantes();
      res.status(200).json(lista);
    } catch (error) {
      res.status(500).json({ error: "Error al listar participantes." });
    }
  },

  async obtener(req, res) {
    try {
      const item = await participanteService.obtenerParticipante(req.params.id);
      if (!item) return res.status(404).json({ error: "Participante no encontrado" });
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el participante." });
    }
  },

  async actualizar(req, res) {
    try {
      const resultado = await participanteService.actualizarParticipante(req.params.id, req.body);
      if (!resultado[0]) return res.status(404).json({ error: "Participante no encontrado" });
      res.status(200).json({ message: "Participante actualizado" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const resultado = await participanteService.eliminarParticipante(req.params.id);
      if (!resultado) return res.status(404).json({ error: "Participante no encontrado" });
      res.status(200).json({ message: "Participante eliminado" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el participante." });
    }
  }
};
