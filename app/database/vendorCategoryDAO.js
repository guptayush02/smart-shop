const { Op } = require('sequelize');
const { VendorCategory } = require("../../models");

const vendorCategoryDAO = {
  async findAllCategories(category) {
    return await VendorCategory.findAll({
      attributes: ['category'],
      where: {
        category: {
          [Op.and]: [
            { [Op.ne]: null },
            { [Op.ne]: '' },
            ...(category ? [{
              [Op.like]: `%${category}%`
            }] : [])
          ]
        }
      },
      group: ['category'],
      raw: true
    });
  },

  async create(params) {
    return await VendorCategory.create(params);
  },

  async findOne(where) {
    return await VendorCategory.findOne(where);
  },

  async update(body, where) {
    return await VendorCategory.update(body, { where });
  }
}

module.exports = vendorCategoryDAO;
