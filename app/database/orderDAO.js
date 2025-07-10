const { Order, VendorResponse, User, Payments } = require("../../models");

const orderDao = {
  async create(params) {
    return await Order.create(params);
  },

  async findAll(where) {
    return await Order.findAll({
      where: where,
      include: [
        {
          model: VendorResponse,
          include: [
            {
              model: User,
              as: 'vendor',
            },
            {
              model: Payments
            }
          ]
        },
        { model: User }
      ]
    });
  },

  async update(payload, where) {
    return await Order.update(payload, { where: where });
  }
}

module.exports = orderDao;
