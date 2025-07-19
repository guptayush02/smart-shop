const orderDAO = require("../../../database/orderDAO");

const QueryController = {
  getQuery: async(req, res) => {
    try {
      const { user: deliveryPartner } = req;
      const { role } = deliveryPartner;
      if (role !== 'delivery_partner') {
        return res.status(404).send({ status: 404, message: "Insufficient permissions" })
      }

      const deliveryPartnerDefaultAddress = deliveryPartner?.Profiles.find((profile) => profile?.defaultAddress);
      const { lat, long } = deliveryPartnerDefaultAddress;

      let orders = await orderDAO.findAllNearestOrdersForDeliveryPartner('processing', process.env.DISTANCE_IN_KM, lat, long);
      return res.status(200).send({status: 200, data: orders})
    } catch (error) {
      console.log("error in delivery_partner getQuery function:", error)
      return res.status(400).send({ status: 400, message: `Error in delivery_partner getQuery function: ${error}` });
    }
  }
}

module.exports = QueryController;
