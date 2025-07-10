module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define('Payments', {
    vendorResponseId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    vendorId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    paymentStatus: DataTypes.STRING,
  }, {
    tableName: 'Payments'
  });

  Payments.associate = (models) => {
    Payments.belongsTo(models.User, { foreignKey: 'vendorId', as: 'vendor' });
    Payments.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Payments.belongsTo(models.Order, { foreignKey: 'orderId' });
    Payments.belongsTo(models.VendorResponse, { foreignKey: 'vendorResponseId' });
  };

  return Payments;
};
