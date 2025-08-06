'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Payments', 'userProfileId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Profiles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('Payments', 'vendorProfileId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Profiles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Payments', 'userProfileId');
    await queryInterface.removeColumn('Payments', 'vendorProfileId');
  }
};
