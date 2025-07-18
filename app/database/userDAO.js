const { User, Profile, VendorCategory } = require("../../models");

const userDao = {
  async findOne(where) {
    return await User.findOne({ where, include: [
      { model: Profile },
      { model: VendorCategory, as: 'vendorCategory' }
    ]});
  },

  async create(params) {
    return await User.create(params);
  }
}

module.exports = userDao;
