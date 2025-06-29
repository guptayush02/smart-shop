const orderDAO = require("../../../database/orderDAO");
const vendorResponseDao = require("../../../database/vendorResponseDAO");

const QueryController = {

  async getQueryForVendor(req, res) {
    try {
      const { category, orderStatus } = req.query;
      const { role } = req.user;
      if (role === 'vendor') {
        // TODO: Fetch all the open order from db based on the vendor catrgory
        // Add vendorID check where vendorId is loggedin vendor
        const orders = await orderDAO.findAll({ category, orderStatus });
        return res.status(200).send({status: 200, data: orders})
      }
      return res.status(404).send({ status: 404, message: "Insufficient permissions" })
    } catch (error) {
      console.log("error in getQueryForVendor function:", error)
      return res.status(400).send({ status: 400, message: `Error in getQueryForVendor function: ${error}` });
    }
  },

  async vendorResponseOnQuery(req, res) {
    try {
      const { orderId, deliverable_quantity, price } = req.body;
      const { id: vendorId, role } = req.user;

      if (role === 'vendor') {
        // Step 2: Notify user about the query
        const response = await vendorResponseDao.create({ orderId, deliverable_quantity, price, vendorId });
        return res.status(200).send({ status: 200, message: "Vendor Response successfully", data: response })
      }
      return res.status(404).send({ status: 404, message: "Insufficient permissions" })
    } catch (error) {
      console.log("error in vendorResponseOnQuery function:", error);
      return res.status(400).send({ status: 400, message: `Error in vendorResponseOnQuery function: ${error}` });
    }
  }
}

module.exports = QueryController;
