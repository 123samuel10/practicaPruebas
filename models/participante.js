"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Participante extends Model {
    static associate(models) {
      // Un participante puede tener muchas asistencias
      Participante.hasMany(models.Asistencia, {
        foreignKey: "participante_id",
        as: "asistencias"
      });
    }
  }

  Participante.init(
    {
      nombre: { type: DataTypes.STRING, allowNull: false },
      correo: { type: DataTypes.STRING, allowNull: false, unique: true },
      telefono: { type: DataTypes.STRING, allowNull: true },
      contraseña: { type: DataTypes.STRING, allowNull: false }
    },
    {
      sequelize,
      modelName: "Participante",
      tableName: "participantes",
      timestamps: true
    }
  );

  return Participante;
};
