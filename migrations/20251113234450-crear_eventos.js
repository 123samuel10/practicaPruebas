"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("eventos", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      titulo: { type: Sequelize.STRING, allowNull: false },
      descripcion: { type: Sequelize.TEXT },
      fecha: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("eventos");
  }
};
