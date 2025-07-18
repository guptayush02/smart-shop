module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  });

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: 'userId' });
    User.hasMany(models.Profile, { foreignKey: 'userId', as: 'Profiles' });
    User.hasMany(models.VendorResponse, { foreignKey: 'vendorId' });
    // User.hasMany(models.Payments, { foreignKey: 'vendorId' });
    // User.hasMany(models.Payments, { foreignKey: 'userId' });
    User.hasOne(models.VendorCategory, {
      foreignKey: 'vendorId',
      as: 'vendorCategory',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return User;
};
