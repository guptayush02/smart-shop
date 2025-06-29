const { Order, VendorResponse, User } = require("../../models");

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
            }
          ]
        },
        { model: User }
      ]
    });
  }
}

module.exports = orderDao;
