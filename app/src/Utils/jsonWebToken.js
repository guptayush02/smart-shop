const jwt = require('jsonwebtoken');

const jsonWebToken = {
  createToken: async(data) => {
    return jwt.sign(data, 'shhhhh');
  },

  decodeToken: async(token) => {
    return jwt.verify(token, 'shhhhh');
  }
}

module.exports = jsonWebToken;
