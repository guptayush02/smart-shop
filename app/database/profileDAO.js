const { Profile } = require("../../models");

const prodileDao = {
  async create(params) {
    return await Profile.create(params);
  },

  async findAll(where) {
    return await Profile.findAll({
      where: where,
      include: 'User'
    });
  },

  async update(options, where) {
    return await Profile.update(options, { where: where });
  },

  async findOne(where) {
    return await Profile.findOne({ where });
  }
}

module.exports = prodileDao;
