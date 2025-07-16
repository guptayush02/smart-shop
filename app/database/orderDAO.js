const { Order, VendorResponse, User, Payments, Profile } = require("../../models");

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
              model: Payments,
              include: [
                {
                  model: Profile,
                  as: 'userProfile'
                },
                {
                  model: Profile,
                  as: 'vendorProfile'
                }
              ]
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
