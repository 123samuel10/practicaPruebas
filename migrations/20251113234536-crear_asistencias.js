"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("asistencias", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      participante_id: {
        type: Sequelize.INTEGER,
        references: { model: "participantes", key: "id" },
        onDelete: "CASCADE"
      },
      evento_id: {
        type: Sequelize.INTEGER,
        references: { model: "eventos", key: "id" },
        onDelete: "CASCADE"
      },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("asistencias");
  }
};
