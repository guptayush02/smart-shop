const { Op, literal } = require('sequelize');
const _ = require('lodash');
const sequelize = require('sequelize');
const { Order, VendorResponse, User, Payments, Profile } = require("../../models");
const connection = require("../database/dbConnection");

const orderDao = {
  async create(params) {
    return await Order.create(params);
  },

  async findAllNearestOrders(whereClause, distanceLimitKm, lat, long) {
    const rawQuery = `
      SELECT 
        o.*, 
        u.id AS userId, u.name AS userName, u.email AS userEmail, u.password AS userPassword, u.role AS userRole, u.createdAt AS userCreatedAt, u.updatedAt AS userUpdatedAt,
        p.id AS profileId, p.lat AS profileLat, p.long AS profileLong, p.address AS profileAddress, p.defaultAddress AS profileDefaultAddress, p.createdAt AS profileCreatedAt, p.updatedAt AS profileUpdatedAt,
        vr.id AS vendorResponseId, vr.orderId AS vrOrderId, vr.price AS vrPrice, vr.deliverable_quantity AS vrDeliverableQuantity,
        vu.id AS vendorId, vu.name AS vendorName,
        pay.id AS paymentId,
        userProfile.id AS userProfileId, userProfile.lat AS userProfileLat, userProfile.long AS userProfileLong,
        vendorProfile.id AS vendorProfileId, vendorProfile.lat AS vendorProfileLat, vendorProfile.long AS vendorProfileLong,
        (
          6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(p.lat)) *
            COS(RADIANS(p.long) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(p.lat))
          )
        ) AS distance
  
      FROM Orders o
      JOIN Users u ON o.userId = u.id
      JOIN Profiles p ON p.userId = u.id AND p.defaultAddress = TRUE
      LEFT JOIN Vendor_Responses vr ON vr.orderId = o.id
      LEFT JOIN Users vu ON vr.vendorId = vu.id
      LEFT JOIN Payments pay ON vr.id = pay.vendorResponseId
      LEFT JOIN Profiles userProfile ON userProfile.id = pay.userProfileId
      LEFT JOIN Profiles vendorProfile ON vendorProfile.id = pay.vendorProfileId
      WHERE o.category = ?
      HAVING distance <= ?
    `;
  
    return new Promise((resolve, reject) => {
      connection.query(rawQuery, [lat, long, lat, whereClause, distanceLimitKm], (err, rows) => {
        if (err) {
          console.error('Query error:', err);
          return reject(err);
        }

        const orders = _.chain(rows)
          .groupBy('id')
          .map((entries, orderId) => {
            const first = entries[0];

            const user = {
              id: first.userId,
              name: first.userName,
              email: first.userEmail,
              password: first.userPassword,
              role: first.userRole,
              createdAt: first.userCreatedAt,
              updatedAt: first.userUpdatedAt,
              Profiles: [{
                id: first.profileId,
                userId: first.userId,
                lat: first.profileLat,
                long: first.profileLong,
                address: first.profileAddress,
                defaultAddress: !!first.profileDefaultAddress,
                createdAt: first.profileCreatedAt,
                updatedAt: first.profileUpdatedAt,
              }]
            };
            // VendorResponses
            const vendorResponses = entries
              .filter(e => e.vendorResponseId)
              .map(e => ({
                id: e.vendorResponseId,
                orderId: e.vrOrderId,
                price: e.vrPrice,
                deliverable_quantity: e.vrDeliverableQuantity,
                vendor: {
                  id: e.vendorId,
                  name: e.vendorName
                },
                Payments: [{
                  id: e.paymentId,
                  userProfile: {
                    id: e.userProfileId,
                    lat: e.userProfileLat,
                    long: e.userProfileLong
                  },
                  vendorProfile: {
                    id: e.vendorProfileId,
                    lat: e.vendorProfileLat,
                    long: e.vendorProfileLong
                  }
                }]
              }));
  
            // Return full order structure
            return {
              id: first.id,
              product: first.product,
              category: first.category,
              orderStatus: first.orderStatus,
              quantity: first.quantity,
              userId: first.userId,
              createdAt: first.createdAt,
              updatedAt: first.updatedAt,
              User: user,
              VendorResponses: vendorResponses
            };
          })
          .value();
  
        resolve(orders);
      });
    });
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
              as: 'vendor'
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
  },

  async findAllCategories(category) {
    return await Order.findAll({
      attributes: ['category'],
      where: {
        category: {
          [Op.and]: [
            { [Op.ne]: null },
            { [Op.ne]: '' },
            ...(category ? [{
              [Op.like]: `%${category}%`
            }] : [])
          ]
        }
      },
      group: ['category'],
      raw: true
    });
  }
}

module.exports = orderDao;
