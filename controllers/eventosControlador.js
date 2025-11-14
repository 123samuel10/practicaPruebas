const eventoService = require("../services/eventoService");

module.exports = {
  async crear(req, res) {
    try {
      const nuevo = await eventoService.crearEvento(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listar(req, res) {
    try {
      const lista = await eventoService.listarEventos();
      res.status(200).json(lista);
    } catch (error) {
      res.status(500).json({ error: "Error al listar eventos." });
    }
  },

  async obtener(req, res) {
    try {
      const item = await eventoService.obtenerEvento(req.params.id);
      if (!item) return res.status(404).json({ error: "Evento no encontrado" });
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el evento." });
    }
  },

  async actualizar(req, res) {
    try {
      const resultado = await eventoService.actualizarEvento(req.params.id, req.body);
      if (!resultado[0]) return res.status(404).json({ error: "Evento no encontrado" });
      res.status(200).json({ mensaje: "Evento actualizado" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const resultado = await eventoService.eliminarEvento(req.params.id);
      if (!resultado) return res.status(404).json({ error: "Evento no encontrado" });
      res.status(200).json({ mensaje: "Evento eliminado" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el evento." });
    }
  }
};
