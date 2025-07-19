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
    // const rawQuery = `
    //   SELECT 
    //     o.*, 
    //     u.id AS userId, u.name AS userName, u.email AS userEmail, u.password AS userPassword, u.role AS userRole, u.createdAt AS userCreatedAt, u.updatedAt AS userUpdatedAt,
    //     p.id AS profileId, p.lat AS profileLat, p.long AS profileLong, p.address AS profileAddress, p.defaultAddress AS profileDefaultAddress, p.createdAt AS profileCreatedAt, p.updatedAt AS profileUpdatedAt,
    //     vr.id AS vendorResponseId, vr.orderId AS vrOrderId, vr.price AS vrPrice, vr.deliverable_quantity AS vrDeliverableQuantity,
    //     vu.id AS vendorId, vu.name AS vendorName,
    //     pay.id AS paymentId, pay.*,
    //     userProfile.id AS userProfileId, userProfile.lat AS userProfileLat, userProfile.long AS userProfileLong,
    //     vendorProfile.id AS vendorProfileId, vendorProfile.lat AS vendorProfileLat, vendorProfile.long AS vendorProfileLong,
    //     (
    //       6371 * ACOS(
    //         COS(RADIANS(?)) * COS(RADIANS(p.lat)) *
    //         COS(RADIANS(p.long) - RADIANS(?)) +
    //         SIN(RADIANS(?)) * SIN(RADIANS(p.lat))
    //       )
    //     ) AS distance
  
    //   FROM Orders o
    //   JOIN Users u ON o.userId = u.id
    //   JOIN Profiles p ON p.userId = u.id AND p.defaultAddress = TRUE
    //   LEFT JOIN Vendor_Responses vr ON vr.orderId = o.id
    //   LEFT JOIN Users vu ON vr.vendorId = vu.id
    //   LEFT JOIN Payments pay ON vr.id = pay.vendorResponseId
    //   LEFT JOIN Profiles userProfile ON userProfile.id = pay.userProfileId
    //   LEFT JOIN Profiles vendorProfile ON vendorProfile.id = pay.vendorProfileId
    //   WHERE o.category = ?
    //   HAVING distance <= ?
    // `;
    const rawQuery = `
        SELECT 
        -- Orders
        o.id AS orderId,
        o.product AS orderProduct,
        o.category AS orderCategory,
        o.orderStatus AS orderStatus,
        o.quantity AS orderQuantity,
        o.userId AS orderUserId,
        o.createdAt AS orderCreatedAt,
        o.updatedAt AS orderUpdatedAt,
      
        -- Users (Buyer)
        u.id AS userId,
        u.name AS userName,
        u.email AS userEmail,
        u.password AS userPassword,
        u.role AS userRole,
        u.createdAt AS userCreatedAt,
        u.updatedAt AS userUpdatedAt,
      
        -- User's Profile (Default Address)
        p.id AS profileId,
        p.userId AS profileUserId,
        p.lat AS profileLat,
        p.long AS profileLong,
        p.address AS profileAddress,
        p.defaultAddress AS profileDefaultAddress,
        p.createdAt AS profileCreatedAt,
        p.updatedAt AS profileUpdatedAt,
      
        -- Vendor Response
        vr.id AS vendorResponseId,
        vr.vendorId AS vrVendorId,
        vr.orderId AS vrOrderId,
        vr.price AS vrPrice,
        vr.deliverable_quantity AS vrDeliverableQuantity,
      
        -- Vendor User (from VendorResponse)
        vu.id AS vendorId,
        vu.name AS vendorName,
        vu.email AS vendorEmail,
        vu.password AS vendorPassword,
        vu.role AS vendorRole,
        vu.createdAt AS vendorCreatedAt,
        vu.updatedAt AS vendorUpdatedAt,
      
        -- Payment
        pay.id AS paymentId,
        pay.vendorResponseId AS payVendorResponseId,
        pay.orderId AS payOrderId,
        pay.price AS payPrice,
        pay.currency AS payCurrency,
        pay.vendorId AS payVendorId,
        pay.userId AS payUserId,
        pay.paymentStatus AS payPaymentStatus,
        pay.razorpayPaymentId AS payRazorpayPaymentId,
        pay.razorpayOrderId AS payRazorpayOrderId,
        pay.userProfileId AS payUserProfileId,
        pay.vendorProfileId AS payVendorProfileId,
        pay.createdAt AS payCreatedAt,
        pay.updatedAt AS payUpdatedAt,
      
        -- Payment's userProfile
        userProfile.id AS userProfileId,
        userProfile.userId AS userProfileUserId,
        userProfile.lat AS userProfileLat,
        userProfile.long AS userProfileLong,
        userProfile.address AS userProfileAddress,
        userProfile.defaultAddress AS userProfileDefaultAddress,
        userProfile.createdAt AS userProfileCreatedAt,
        userProfile.updatedAt AS userProfileUpdatedAt,
      
        -- Payment's vendorProfile
        vendorProfile.id AS vendorProfileId,
        vendorProfile.userId AS vendorProfileUserId,
        vendorProfile.lat AS vendorProfileLat,
        vendorProfile.long AS vendorProfileLong,
        vendorProfile.address AS vendorProfileAddress,
        vendorProfile.defaultAddress AS vendorProfileDefaultAddress,
        vendorProfile.createdAt AS vendorProfileCreatedAt,
        vendorProfile.updatedAt AS vendorProfileUpdatedAt,
      
        -- Distance calculation
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
    `

    return new Promise((resolve, reject) => {
      connection.query(rawQuery, [lat, long, lat, whereClause, distanceLimitKm], (err, rows) => {
        if (err) {
          console.error('Query error:', err);
          return reject(err);
        }
    
        const orders = _.chain(rows)
          .groupBy('orderId')
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
                userId: first.profileUserId,
                lat: first.profileLat,
                long: first.profileLong,
                address: first.profileAddress,
                defaultAddress: !!first.profileDefaultAddress,
                createdAt: first.profileCreatedAt,
                updatedAt: first.profileUpdatedAt,
              }]
            };
    
            const vendorResponses = entries
              .filter(e => e.vendorResponseId)
              .map(e => ({
                id: e.vendorResponseId,
                vendorId: e.vrVendorId,
                orderId: e.vrOrderId,
                price: e.vrPrice,
                deliverable_quantity: e.vrDeliverableQuantity,
                vendor: {
                  id: e.vendorId,
                  name: e.vendorName,
                  email: e.vendorEmail,
                  password: e.vendorPassword,
                  role: e.vendorRole,
                  createdAt: e.vendorCreatedAt,
                  updatedAt: e.vendorUpdatedAt,
                },
                Payments: e.paymentId ? {
                  id: e.paymentId,
                  vendorResponseId: e.payVendorResponseId,
                  orderId: e.payOrderId,
                  price: e.payPrice,
                  currency: e.payCurrency,
                  vendorId: e.payVendorId,
                  userId: e.payUserId,
                  paymentStatus: e.payPaymentStatus,
                  razorpayPaymentId: e.payRazorpayPaymentId,
                  razorpayOrderId: e.payRazorpayOrderId,
                  createdAt: e.payCreatedAt,
                  updatedAt: e.payUpdatedAt,
                  userProfile: e.userProfileId ? {
                    id: e.userProfileId,
                    userId: e.userProfileUserId,
                    lat: e.userProfileLat,
                    long: e.userProfileLong,
                    address: e.userProfileAddress,
                    defaultAddress: !!e.userProfileDefaultAddress,
                    createdAt: e.userProfileCreatedAt,
                    updatedAt: e.userProfileUpdatedAt,
                  } : null,
                  vendorProfile: e.vendorProfileId ? {
                    id: e.vendorProfileId,
                    userId: e.vendorProfileUserId,
                    lat: e.vendorProfileLat,
                    long: e.vendorProfileLong,
                    address: e.vendorProfileAddress,
                    defaultAddress: !!e.vendorProfileDefaultAddress,
                    createdAt: e.vendorProfileCreatedAt,
                    updatedAt: e.vendorProfileUpdatedAt,
                  } : null
                } : null
              }));
    
            return {
              id: first.orderId,
              product: first.orderProduct,
              category: first.orderCategory,
              orderStatus: first.orderStatus,
              quantity: first.orderQuantity,
              userId: first.orderUserId,
              createdAt: first.orderCreatedAt,
              updatedAt: first.orderUpdatedAt,
              User: user,
              VendorResponses: vendorResponses,
              distance: first.distance
            };
          })
          .value();
    
        resolve(orders);
      });
    });    
    // return new Promise((resolve, reject) => {
    //   connection.query(rawQuery, [lat, long, lat, whereClause, distanceLimitKm], (err, rows) => {
    //     if (err) {
    //       console.error('Query error:', err);
    //       return reject(err);
    //     }

    //     const orders = _.chain(rows)
    //       .groupBy('id')
    //       .map((entries, orderId) => {
    //         const first = entries[0];

    //         const user = {
    //           id: first.userId,
    //           name: first.userName,
    //           email: first.userEmail,
    //           password: first.userPassword,
    //           role: first.userRole,
    //           createdAt: first.userCreatedAt,
    //           updatedAt: first.userUpdatedAt,
    //           Profiles: [{
    //             id: first.profileId,
    //             userId: first.userId,
    //             lat: first.profileLat,
    //             long: first.profileLong,
    //             address: first.profileAddress,
    //             defaultAddress: !!first.profileDefaultAddress,
    //             createdAt: first.profileCreatedAt,
    //             updatedAt: first.profileUpdatedAt,
    //           }]
    //         };
    //         // VendorResponses
    //         const vendorResponses = entries
    //           .filter(e => e.vendorResponseId)
    //           .map(e => ({
    //             id: e.vendorResponseId,
    //             orderId: e.vrOrderId,
    //             price: e.vrPrice,
    //             deliverable_quantity: e.vrDeliverableQuantity,
    //             vendor: {
    //               id: e.vendorId,
    //               name: e.vendorName
    //             },
    //             Payments: {
    //               id: e.paymentId,
    //               vendorResponseId: e.vendorResponseId,
    //               orderId: e.orderId,
    //               price: e.price,
    //               currency: e.currency,
    //               vendorId: e.vendorId,
    //               userId: e.userId,
    //               paymentStatus: e.paymentStatus,
    //               razorpayPaymentId: e.razorpayPaymentId,
    //               razorpayOrderId: e.razorpayOrderId,
    //               userProfile: {
    //                 id: e.userProfileId,
    //                 lat: e.userProfileLat,
    //                 long: e.userProfileLong
    //               },
    //               vendorProfile: {
    //                 id: e.vendorProfileId,
    //                 lat: e.vendorProfileLat,
    //                 long: e.vendorProfileLong
    //               }
    //             }
    //           }));
  
    //         // Return full order structure
    //         return {
    //           id: first.id,
    //           product: first.product,
    //           category: first.category,
    //           orderStatus: first.orderStatus,
    //           quantity: first.quantity,
    //           userId: first.userId,
    //           createdAt: first.createdAt,
    //           updatedAt: first.updatedAt,
    //           User: user,
    //           VendorResponses: vendorResponses
    //         };
    //       })
    //       .value();
  
    //     resolve(orders);
    //   });
    // });
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
