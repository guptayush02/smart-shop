const orderDAO = require("../../../database/orderDAO");
const vendorResponseDao = require("../../../database/vendorResponseDAO");
const openAIFunctions = require("../../Utils/openai");
const extractJsonFromResponse = require("../../Utils/extractJSONContent");

const QueryController = {

  async getQueryForVendor(req, res) {
    try {
      const { category, orderStatus } = req.query;
      const { role } = req.user;
      if (role === 'vendor') {
        // TODO: Fetch all the open order from db based on the vendor catrgory
        // Add vendorID check where vendorId is loggedin vendor
        const orders = await orderDAO.findAll({ category }); //orderStatus
        // const prompt = await openAIFunctions.analysisObjectFromAi(orders);
        // console.log("prompt:", prompt)
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
      const { query, orderId } = req.body;
      const prompt = 'You are a helpful assistant that extracts order fulfilment details in structured JSON format also tell us about the deliverable_quantity and price of the product vendor is salling, also every time please return a single object I dont want nested object also I want price and currency in different key'
      const content = await openAIFunctions.analysisQueryFromAi(query, prompt);
      const extracted = extractJsonFromResponse(content);
      if (!extracted.deliverable_quantity || !extracted.price) {
        return res.status(404).send({status: 404, message: 'Price or deliverable quantity is missing'});
      }

      const { deliverable_quantity, price } = extracted;
      const { id: vendorId, role } = req.user;

      if (role === 'vendor') {
        // Step 2: Notify user about the query
        await vendorResponseDao.create({ orderId, deliverable_quantity, price, vendorId });
        const orders = await orderDAO.findAll({ category: 'clothing', orderStatus: 'pending' });
        return res.status(200).send({ status: 200, message: "Vendor Response successfully", data: orders })
      }
      return res.status(404).send({ status: 404, message: "Insufficient permissions" })
    } catch (error) {
      console.log("error in vendorResponseOnQuery function:", error);
      return res.status(400).send({ status: 400, message: `Error in vendorResponseOnQuery function: ${error}` });
    }
  }
}

module.exports = QueryController;
