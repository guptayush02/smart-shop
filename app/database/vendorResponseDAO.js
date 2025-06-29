const { VendorResponse } = require("../../models");

const vendorResponseDao = {
  async create(params) {
    return await VendorResponse.create(params);
  }
}

module.exports = vendorResponseDao;
