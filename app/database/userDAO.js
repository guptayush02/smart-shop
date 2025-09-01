const { User, Profile, VendorCategory } = require("../../models");

const userDao = {
  async findOne(where) {
    return await User.findOne({ where, include: [
      { model: Profile, as: 'Profiles' },
      { model: VendorCategory, as: 'vendorCategory' }
    ]});
  },

  async create(params, options = {}) {
    return await User.create(params, options);
  },

  async update(options, where) {
    return await User.update(options, { where: where });
  }
}

module.exports = userDao;
