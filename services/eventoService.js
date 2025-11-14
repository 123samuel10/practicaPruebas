const { Evento } = require("../models");

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

    return Evento.create(datosEvento);
  },

  async listarEventos() {
    return Evento.findAll();
  },

  async obtenerEvento(id) {
    return Evento.findByPk(id);
  },

  async actualizarEvento(id, datos) {
    // Primero, nos aseguramos de que el evento exista.
    const evento = await Evento.findByPk(id);
    if (!evento) return [0]; // Devuelve 0 filas afectadas si no se encuentra

    return Evento.update(datos, { where: { id } });
  },

  async eliminarEvento(id) {
    return Evento.destroy({ where: { id } });
  },
};