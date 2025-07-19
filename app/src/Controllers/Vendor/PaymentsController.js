const paymentDao = require("../../../database/paymentDAO");

const PaymentsController = {
  paymentDetails: async(req, res) => {
    try {
      const { user: vendor } = req;
      const { paymentStatus } = req.query;
      let [ totalEarning, vendorPayments ] = await Promise.all([
        paymentDao.totalEarning({ vendorId: vendor?.id, paymentStatus: 'completed' }),
        paymentDao.findAll({ vendorId: vendor?.id, ...(paymentStatus ? { paymentStatus } : {}) })
      ]);
      vendorPayments = vendorPayments.map((payment) => payment.toJSON());
      totalEarning = totalEarning.map((payment) => payment.toJSON());
      console.log("vendorPayments", vendorPayments)
      console.log("totalEarning:", totalEarning)
      const paymentDetails = {
        vendorPayments,
        ...totalEarning[0]
      }
      return res.status(200).send({ status: 200, message: 'Vendor Payments details fetch successfully', data: paymentDetails });
    } catch (error) {
      console.log("error in vandor paymentDetails function:", error)
      return res.status(400).send({ status: 400, message: `Error in vandor paymentDetails function: ${error}` });
    }
  }
}

module.exports = PaymentsController;
