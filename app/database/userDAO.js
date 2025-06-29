const { User } = require("../../models");

const userDao = {
  async findOne(where) {
    return await User.findOne({ where, include: 'Profiles' });
  },

  async create(params) {
    return await User.create(params);
  }
}

module.exports = userDao;
