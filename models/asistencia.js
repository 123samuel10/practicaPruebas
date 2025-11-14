"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Asistencia extends Model {
    static associate(models) {
      // Una asistencia pertenece a un participante
      Asistencia.belongsTo(models.Participante, {
        foreignKey: "participante_id",
        as: "participante"
      });

      // Una asistencia pertenece a un evento
      Asistencia.belongsTo(models.Evento, {
        foreignKey: "evento_id",
        as: "evento"
      });
    }
  }

  Asistencia.init(
    {
      participante_id: { type: DataTypes.INTEGER, allowNull: false },
      evento_id: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      sequelize,
      modelName: "Asistencia",
      tableName: "asistencias",
      timestamps: true
    }
  );

  return Asistencia;
};
