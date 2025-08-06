'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Payments', 'razorpayPaymentId', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Payments', 'razorpayOrderId', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Payments', 'razorpayPaymentId');
    await queryInterface.removeColumn('Payments', 'razorpayOrderId');
  }
};
