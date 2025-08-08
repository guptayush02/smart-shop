const vendorResponseDao = require("../../../database/vendorResponseDAO");
const orderDAO = require("../../../database/orderDAO");
const paymentDAO = require("../../../database/paymentDAO");
const profileDAO = require("../../../database/profileDAO");
const riderDAO = require("../../../database/riderDAO");
const Razorpay = require('razorpay');
const userDAO = require("../../../database/userDAO");

const OrderController = {
  
  async placeOrder(req, res) {
    try {
      const { vendorResponseId, orderStatus, razorpayPaymentId, razorpayOrderId } = req.body;
      let vendorResponse = await vendorResponseDao.findOne({ id: vendorResponseId });
      if (!vendorResponse) {
        return res.status(404).send({status: 404, message: 'Vendor response not found'})
      }
      vendorResponse = vendorResponse.toJSON();

      const userId = vendorResponse?.Order?.userId;
      const { price, vendorId, orderId } = vendorResponse;

      // find nearest riders from the vendor
      let vedor = await userDAO.findOne({ id: vendorId, '$Profiles.defaultAddress$': true });
      if (vedor) {
        vedor = vedor.toJSON();
        console.log("vedor:", vedor?.Profiles[0])
        const { lat, long } = vedor?.Profiles[0];
        
        const nearestRider = await riderDAO.findNearestRider(lat, long);
        console.log("nearestRider:", nearestRider)
      }

      return;
      
      const updateData = { orderStatus };
      const where = { id: orderId };
      await orderDAO.update(updateData, where);

      let [ defaultAddress, vendorProfile ] = await Promise.all([profileDAO.findOne({ defaultAddress: true, userId }), profileDAO.findOne({ defaultAddress: true, userId: vendorId })]);
      if (!defaultAddress) {
        return res.status(404).send({ status: 404, message: 'Please select a default address' });
      }
      defaultAddress = defaultAddress.toJSON();
      vendorProfile = vendorProfile ? vendorProfile.toJSON() : {};
      
      let existingPayment = await paymentDAO.findOne({ vendorResponseId: vendorResponse.id });
      if (existingPayment) {
        existingPayment = existingPayment.toJSON();
        const updatePayload = {
          paymentStatus: 'completed',
          price,
          currency: 'INR',
          userProfileId: defaultAddress?.id,
          vendorProfileId: vendorProfile?.id || null,
          razorpayPaymentId,
          razorpayOrderId
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
          paymentStatus: 'completed',
          profileId: defaultAddress?.id,
          vendorProfileId: vendorProfile?.id || null,
          razorpayPaymentId,
          razorpayOrderId
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
  },

  async paymentInitiate(req, res) {
    try {
      const { price } = req.body
      const razorpay = new Razorpay({
        key_id: process.env.RZP_TEST_KEY,
        key_secret: process.env.RZP_SECRET_KEY,
      });

      const order = await razorpay.orders.create({
        amount: price * 100, // amount in paisa
        currency: 'INR',
        receipt: 'receipt#1',
        payment_capture: 1,
      });

      const paymentLinkPayload = {
        amount: price * 100,          // amount in paise
        currency: 'INR',
        accept_partial: false,        // whether partial payments are allowed
        first_min_partial_amount: 0,  // minimum amount if partial payment
        description: 'Payment for application order',
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: true,
        callback_url: 'http://192.168.1.13:3000/api/v1/user/payment-callback', // your payment success URL
        callback_method: 'get',
        notes: {
          receipt: 'receipt#1',       // or any unique identifier from your side
        },
      };
  
      // Create Payment Link
      const paymentLink = await razorpay.paymentLink.create(paymentLinkPayload);
      return res.status(200).send({ status: 200, data: {...order, paymentLink} });
    } catch (error) {
      console.log("error in paymentInitiate function:", error)
      return res.status(400).send({status: 400, error: `error in paymentInitiate function ${error}`});
    }
  },

  async paymentCallback(req, res) {
    try {
      console.log("req:", req.query)
      return res.status(200).send({ status: 200, data: req.query });
    } catch (error) {
      console.log("error in paymentCallback function:", error)
      return res.status(400).send({status: 400, error: `error in paymentCallback function ${error}`});
    
    }
  }
}

module.exports = OrderController;
  