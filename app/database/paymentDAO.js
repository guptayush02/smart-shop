const { Payments, VendorResponse, Order } = require("../../models");
const { fn, col } = require('sequelize');

const paymentDao = {
  async create(params) {
    return await Payments.create(params);
  },

  async findOne(where) {
    return await Payments.findOne({ where });
  },

  async update(payload, where) {
    return await Payments.update(payload, { where: where })
  },

  async findAll(where) {
    return await Payments.findAll({
      where,
      include: [
        { model: VendorResponse },
        { model: Order }
      ]
    });
  },

  async totalEarning(where) {
    return await Payments.findAll({
      attributes: [
        'vendorId',
        [fn('SUM', col('price')), 'totalPaid'],
      ],
      where,
      group: ['vendorId'],
    });
  }
}

module.exports = paymentDao;
