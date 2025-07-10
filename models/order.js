module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    product: DataTypes.STRING,
    category: DataTypes.STRING,
    orderStatus: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    quantity: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'userId' });
    Order.hasMany(models.VendorResponse, { foreignKey: 'orderId' });
    // Order.hasMany(models.Order, { foreignKey: 'orderId' });
  };

  return Order;
};
