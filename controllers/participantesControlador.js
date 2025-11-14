const { Participante } = require("../models"); // ← corregido

module.exports = {
  async crear(req, res) {
    try {
      const nuevo = await Participante.create(req.body);
      res.json(nuevo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listar(req, res) {
    const lista = await Participante.findAll({
      include: [
        { model: require("../models").Asistencia, as: "asistencias" }
      ]
    });
    res.json(lista);
  },

  async obtener(req, res) {
    const item = await Participante.findByPk(req.params.id, {
      include: [
        { model: require("../models").Asistencia, as: "asistencias" }
      ]
    });
    if (!item) return res.status(404).json({ error: "Participante no encontrado" });
    res.json(item);
  },

  async actualizar(req, res) {
    await Participante.update(req.body, { where: { id: req.params.id } });
    res.json({ mensaje: "Participante actualizado" });
  },

  async eliminar(req, res) {
    await Participante.destroy({ where: { id: req.params.id } });
    res.json({ mensaje: "Participante eliminado" });
  }
};
