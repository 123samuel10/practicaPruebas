const { Participante, Asistencia } = require("../models");

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

    return Participante.create(datos);
  },

  async listarParticipantes() {
    return Participante.findAll({
      include: [{ model: Asistencia, as: "asistencias" }]
    });
  },

  async obtenerParticipante(id) {
    return Participante.findByPk(id, {
      include: [{ model: Asistencia, as: "asistencias" }]
    });
  },

  async actualizarParticipante(id, datos) {
    const participante = await Participante.findByPk(id);
    if (!participante) return [0];

    return Participante.update(datos, { where: { id } });
  },

  async eliminarParticipante(id) {
    return Participante.destroy({ where: { id } });
  },
};