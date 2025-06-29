module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    userId: DataTypes.INTEGER,
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT,
    address: DataTypes.STRING
  }, {
    tableName: 'Profiles'
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Profile;
};
