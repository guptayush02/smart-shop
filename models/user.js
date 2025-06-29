module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  });

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: 'userId' });
    User.hasMany(models.Profile, { foreignKey: 'userId' });
    User.hasMany(models.VendorResponse, { foreignKey: 'vendorId' });
  };

  return User;
};
