const vendorResponseDao = require("../../../database/vendorResponseDAO");
const orderDAO = require("../../../database/orderDAO");
const paymentDAO = require("../../../database/paymentDAO");

const OrderController = {
  
  async placeOrder(req, res) {
    try {
      const { vendorResponseId, orderStatus } = req.body;
      let vendorResponse = await vendorResponseDao.findOne({ id: vendorResponseId });
      if (!vendorResponse) {
        return res.status(404).send({status: 404, message: 'Vendor response not found'})
      }
      vendorResponse = vendorResponse.toJSON();

      const userId = vendorResponse?.Order?.userId;
      const { price, vendorId, orderId } = vendorResponse;
      
      const updateData = { orderStatus };
      const where = { id: orderId };
      await orderDAO.update(updateData, where );
      
      let existingPayment = await paymentDAO.findOne({ vendorResponseId: vendorResponse.id });
      if (existingPayment) {
        existingPayment = existingPayment.toJSON();
        const updatePayload = {
          paymentStatus: 'complete',
          price,
          currency: 'INR'
        }
        const where = { userId, vendorResponseId, vendorId, orderId }
        await paymentDAO.update(updatePayload, where)
      } else {
        const paymentParams = {
          price,
          currency: 'INR',
          userId,
          orderId,
          vendorId,
          vendorResponseId,
          paymentStatus: 'processing'
        }
        await paymentDAO.create(paymentParams);
      }
      const allOrder = await orderDAO.findAll({ userId })
      const jsonData = allOrder.map(order => order.toJSON());
      return res.status(200).send({status: 200, message: 'Order place successfully, will update you shortly', data: jsonData});
    } catch (error) {
      console.log("error in placeOrder function:", error)
      return res.status(400).send({status: 400, error: `error in placeOrder function ${error}`});
    }
  }
}

module.exports = OrderController;
  