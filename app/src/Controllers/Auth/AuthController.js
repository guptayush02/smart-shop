const userDao = require("../../../database/userDAO");
const profileDao = require("../../../database/profileDAO");
const bcryptjsScript = require("../../Utils/bcryptjs");
const jsonWebToken = require("../../Utils/jsonWebToken");

const AuthController = {

  async login(req, res) {
    try {
      const { email, password } = req.body;

      let exist = await userDao.findOne({ email });
      if (!exist) {
        return res.status(404).send({ status: 404, message: "Email not exist" });
      }
      exist = exist.toJSON();

      const isMatchPass = await bcryptjsScript.decryption(password, exist.password);
      if (!isMatchPass) {
        return res.send(404).send({ status: 404, message: "Incorrect password" });
      }

      const token = await jsonWebToken.createToken({ id: exist.id, email });
      return res.status(200).send({ status: 200, message: "Login Successfully", data: {...exist, token} })
    } catch(error) {
      console.log("error in login function:", error)
      return res.status(400).send({ status: 400, error: `Error in AuthController in Login function: ${error}` })
    }
  },

  async createAccount(req, res) {
    try {
      const { name, email, password, role, lat, long, address } = req.body;

      const exist = await userDao.findOne({ email });
      if (exist) {
        return res.status(404).send({ status: 404, message: "Email is already exist" });
      }

      const hash = await bcryptjsScript.encryption(password);
      let createdUser = await userDao.create({ name, email, password: hash, role });
      let user = createdUser.toJSON();

      if (role != 'admin') {
        const payload = { userId: user.id, lat, long, address, defaultAddress: true };
        await profileDao.create(payload);
        createdUser = await profileDao.findAll({ userId: user.id });
      }

      return res.status(200).send({status: 200, message: "Profile create successfully"});
    } catch(error) {
      console.log("error in login function:", error);
      return res.status(400).send({ status: 400, error: `Error in AuthController in Signup function: ${error}` });
    }
  },

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
      return res.status(200).send({ status: 200, message: 'Address saved successfully' })
    } catch (error) {
      console.log("error in user saveAddress function:", error)
      return res.status(400).send({ status: 400, error: `Error in user saveAddress function: ${error}` })
    }
  },

  async updateProfile(req, res) {
    try {
      const { user } = req;
      const { defaultAddress } = req.body;
      const { id } = req.params;
      const where = { id };
      const options = { defaultAddress };
      await profileDao.update({ defaultAddress: false }, { userId: user?.id });
      await profileDao.update(options, where);
      return res.status(200).send({ status: 200, message: 'Address update successfully' });
    } catch(error) {
      console.log("error in user updateProfile function:", error)
      return res.status(400).send({ status: 400, error: `Error in user updateProfile function: ${error}` })
    }
  }
}

module.exports = AuthController;
