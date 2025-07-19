module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define('Payments', {
    vendorResponseId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    vendorId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    paymentStatus: DataTypes.STRING,
    razorpayPaymentId: DataTypes.STRING,
    razorpayOrderId: DataTypes.STRING,
    userProfileId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Profiles',
        key: 'id',
      },
    },
    vendorProfileId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Profiles',
        key: 'id',
      },
    }
  }, {
    tableName: 'Payments'
  });

  Payments.associate = (models) => {
    Payments.belongsTo(models.User, { foreignKey: 'vendorId', as: 'vendor' });
    Payments.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Payments.belongsTo(models.Order, { foreignKey: 'orderId' });
    Payments.belongsTo(models.VendorResponse, { foreignKey: 'vendorResponseId' });
    Payments.belongsTo(models.Profile, { foreignKey: 'userProfileId', as: 'userProfile' });
    Payments.belongsTo(models.Profile, { foreignKey: 'vendorProfileId', as: 'vendorProfile' });
  };

  return Payments;
};
