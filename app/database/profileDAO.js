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
  }
}

module.exports = prodileDao;
