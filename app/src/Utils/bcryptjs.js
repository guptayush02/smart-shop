const bcrypt = require('bcryptjs');

const bcryptjsScript = {
  encryption: async(password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, Salt) {
          bcrypt.hash(password, Salt, function (err, hash) {
            if (err) {
              console.log('Cannot encrypt:', err);
              return reject(err)
            }
            return resolve(hash)
          })
        })
    })
  },

  decryption: async(password, hashedPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword,
        async function (err, isMatch) {
          if (err) {
            return reject(err)
          }
          return resolve(isMatch)
        }
      )
    })
  }
}

module.exports = bcryptjsScript;
