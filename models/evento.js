"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Evento extends Model {
    static associate(models) {
      // Un evento puede tener muchas asistencias
      Evento.hasMany(models.Asistencia, {
        foreignKey: "evento_id",
        as: "asistencias"
      });
    }
  }

  Evento.init(
    {
      titulo: { type: DataTypes.STRING, allowNull: false },
      descripcion: { type: DataTypes.TEXT },
      fecha: { type: DataTypes.DATE, allowNull: false },
      ubicacion: { type: DataTypes.STRING },
      capacidad: { type: DataTypes.INTEGER }
    },
    {
      sequelize,
      modelName: "Evento",
      tableName: "eventos",
      timestamps: true
    }
  );

  return Evento;
};
