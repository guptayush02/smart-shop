module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    userId: DataTypes.INTEGER,
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT,
    address: DataTypes.STRING,
    defaultAddress: DataTypes.BOOLEAN
  }, {
    tableName: 'Profiles'
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, { foreignKey: 'userId' });
    // Profile.hasMany(models.Payments, { foreignKey: 'profileId', as: 'payments' });
    Profile.hasMany(models.Payments, { foreignKey: 'userProfileId', as: 'userPayments' });
    Profile.hasMany(models.Payments, { foreignKey: 'vendorProfileId', as: 'vendorPayments'});
  };

  return Profile;
};
