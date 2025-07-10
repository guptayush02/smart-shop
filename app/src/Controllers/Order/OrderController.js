const vendorResponseDao = require("../../../database/vendorResponseDAO");
const orderDAO = require("../../../database/orderDAO");

const OrderController = {
  
  async placeOrder(req, res) {
    try {
      console.log("Order place by user")
      const { vendorResponseId, orderStatus } = req.body;
      console.log("vendorResponseId:", vendorResponseId)
      let vendorResponse = await vendorResponseDao.findOne({ id: vendorResponseId });
      vendorResponse = vendorResponse.toJSON();
      console.log("vendorResponse:", vendorResponse)
      const updateData = { orderStatus };
      const where = { id: vendorResponse?.Order?.id }
      console.log("where:", where)
      const updateOrder = await orderDAO.update(updateData, where );
      console.log("updateOrder:", updateOrder)
      return;
      // TODO: order place by user and payment integration
    } catch (error) {
      console.log("error in placeOrder function:", error)
    }
  }
}

module.exports = OrderController;
  