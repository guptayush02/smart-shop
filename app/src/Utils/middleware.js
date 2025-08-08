const jsonWebToken = require("./jsonWebToken");
const userDAO = require("../../database/userDAO");

const middleware = {
  authenticate: async(req, res, next) => {
    if (req.path === '/payment-callback') {
      return next();
    }
    const { token } = req.headers;
    const decodedData = await jsonWebToken.decodeToken(token);
    if (!decodedData) {
      return res.status(404).send({ status: 404, message: 'Invalid token' });
    }

    let user = await userDAO.findOne({ id: decodedData.id });
    user = user.toJSON();
    req.user = user;
    next();
  }
}

module.exports = middleware;
