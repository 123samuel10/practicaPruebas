const { Evento } = require("../models"); // ← con E mayúscula

module.exports = {
  async crear(req, res) {
    try {
      const nuevo = await Evento.create(req.body);
      res.json(nuevo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listar(req, res) {
    const lista = await Evento.findAll(); // ← aquí ya no será undefined
    res.json(lista);
  },

  async obtener(req, res) {
    const item = await Evento.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Evento no encontrado" });
    res.json(item);
  },

  async actualizar(req, res) {
    await Evento.update(req.body, { where: { id: req.params.id } });
    res.json({ mensaje: "Evento actualizado" });
  },

  async eliminar(req, res) {
    await Evento.destroy({ where: { id: req.params.id } });
    res.json({ mensaje: "Evento eliminado" });
  }
};
