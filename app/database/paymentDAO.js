const { Payments } = require("../../models");

const paymentDao = {
  async create(params) {
    return await Payments.create(params);
  },

  async findOne(where) {
    return await Payments.findOne({ where });
  },

  async update(payload, where) {
    return await Payments.update(payload, { where: where })
  }
}

module.exports = paymentDao;
