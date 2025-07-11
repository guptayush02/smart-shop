const userDao = require("../../../database/userDAO");
const profileDao = require("../../../database/profileDAO");

const UserController = {
  
  async getProfile(req, res) {
    try {
      return res.status(200).send({status: 200, data: req.user});
    } catch (error) {
      console.log("error in user profile function:", error)
      return res.status(400).send({ status: 400, error: `Error in user profile function: ${error}` })
    }
  },

  async saveAddress(req, res) {
    try {
      const { user } = req;
      const { houseNumber, area, city, pinCode } = req.body;
      await profileDao.create({ userId: user.id, address: `${houseNumber}, ${area} ${city} ${pinCode}` });
      res.status(200).send({ status: 200, message: 'Address saved successfully' })
    } catch (error) {
      console.log("error in user saveAddress function:", error)
      return res.status(400).send({ status: 400, error: `Error in user saveAddress function: ${error}` })
    }
  }
}

module.exports = UserController;
