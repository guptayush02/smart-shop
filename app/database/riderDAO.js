// const connection = require("../database/dbConnection");

// const riderDao = {
//   findNearestRider: async(lat, long) => {
//     const rawQuery = `
//       SELECT 
//         u.id AS userId,
//         u.name AS userName,
//         p.lat,
//         p.long,
//         (
//           6371 * acos(
//             cos(radians(?)) *
//             cos(radians(p.lat)) *
//             cos(radians(p.long) - radians(?)) +
//             sin(radians(?)) *
//             sin(radians(p.lat))
//           )
//         ) AS distance_km
//       FROM users u
//       JOIN profiles p ON u.id = p.userId
//       WHERE u.role = 'delivery_partner'
//       ORDER BY distance_km ASC
//       LIMIT 1;
//     `;

//     return new Promise((resolve, reject) => {
//       connection.query(rawQuery, [lat, long, lat], (err, rows) => {
//         if (err) return reject(err);
//         console.log("rows:", rows);
//         resolve(rows[0]);
//       });
//     });
//   }
// }

// module.exports = riderDao;

const connection = require("../database/dbConnection");

const riderDao = {
  findNearestRider: async (lat, long, radiusKm = 5) => {
    const rawQuery = `
      SELECT 
        u.id AS userId,
        u.name AS userName,
        u.email AS userEmail,
        u.role AS userRole,

        p.id AS profileId,
        p.lat AS profileLat,
        p.long AS profileLong,
        p.address AS profileAddress,
        p.defaultAddress AS profileDefaultAddress,

        (
          6371 * acos(
            cos(radians(?)) *
            cos(radians(p.lat)) *
            cos(radians(p.long) - radians(?)) +
            sin(radians(?)) *
            sin(radians(p.lat))
          )
        ) AS distance_km

      FROM users u
      JOIN profiles p ON u.id = p.userId
      WHERE u.role = 'delivery_partner'

      HAVING distance_km <= ?
      ORDER BY distance_km ASC;
    `;

    const values = [lat, long, lat, radiusKm];

    return new Promise((resolve, reject) => {
      connection.query(rawQuery, values, (err, rows) => {
        if (err) {
          console.error("Error in findNearbyDeliveryPartners:", err);
          return reject(err);
        }

        const results = rows.map(row => ({
          rider: {
            id: row.userId,
            name: row.userName,
            email: row.userEmail,
            role: row.userRole
          },
          profile: {
            id: row.profileId,
            lat: row.profileLat,
            long: row.profileLong,
            address: row.profileAddress,
            defaultAddress: row.profileDefaultAddress
          },
          distance_km: parseFloat(row.distance_km.toFixed(2))
        }));

        return resolve(results);
      });
    });
  }
};

module.exports = riderDao;
