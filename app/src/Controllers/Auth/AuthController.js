const userDao = require("../../../database/userDAO");
const prodileDao = require("../../../database/profileDAO");
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

  async signup(req, res) {
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
        const payload = { userId: user.id, lat, long, address };
        await prodileDao.create(payload);
        createdUser = await prodileDao.findAll({ userId: user.id });
      }

      return res.status(200).send({status: 200, message: "Profile create successfully"});
    } catch(error) {
      console.log("error in login function:", error);
      return res.status(400).send({ status: 400, error: `Error in AuthController in Signup function: ${error}` });
    }
  }
}

module.exports = AuthController;
