const { VendorResponse } = require("../../models");

const vendorResponseDao = {
  async create(params) {
    return await VendorResponse.create(params);
  },

  async findOne(where) {
    return await VendorResponse.findOne({ where, include: 'Order' });
  }
}

module.exports = vendorResponseDao;
