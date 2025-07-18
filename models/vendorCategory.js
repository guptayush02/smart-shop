'use strict';

module.exports = (sequelize, DataTypes) => {
  const VendorCategory = sequelize.define('VendorCategory', {
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Vendor_Categories',
  });

  VendorCategory.associate = function(models) {
    VendorCategory.belongsTo(models.User, {
      foreignKey: 'vendorId',
      as: 'vendor',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return VendorCategory;
};
