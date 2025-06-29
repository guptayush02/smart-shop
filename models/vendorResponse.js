module.exports = (sequelize, DataTypes) => {
  const VendorResponse = sequelize.define('VendorResponse', {
    vendorId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    deliverable_quantity: DataTypes.INTEGER
  }, {
    tableName: 'Vendor_Responses'
  });

  VendorResponse.associate = (models) => {
    VendorResponse.belongsTo(models.User, { foreignKey: 'vendorId', as: 'vendor' });
    VendorResponse.belongsTo(models.Order, { foreignKey: 'orderId' });
  };

  return VendorResponse;
};
