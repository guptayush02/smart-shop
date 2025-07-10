const extractJsonFromResponse = require("../../Utils/extractJSONContent");
const openAIFunctions = require("../../Utils/openai");
const orderDao = require("../../../database/orderDAO");

const QueryController = {
  
  async userQuery(req, res) {
    try {
      const { query } = req.body;
      const { id: userId } = req.user

      const prompt = 'You are a helpful assistant that extracts purchase requests in structured JSON format also tell us in which vendor category that product fall, also please make the response and the key same one key should be product and another key will be catrgory also let me know the quantity user wants.';
      const content = await openAIFunctions.analysisQueryFromAi(query, prompt);
      const extracted = extractJsonFromResponse(content)

      const params = {
        product: extracted.product,
        category: extracted.category,
        userId,
        quantity: extracted.quantity || 0
      }
      await orderDao.create(params)
      const allOrder = await orderDao.findAll({ userId })
      const jsonData = allOrder.map(order => order.toJSON());
      // TODO Notify all nearest vendor via push notification.
      return res.status(200).send({status: 200, data: jsonData})
    } catch (error) {
      console.log("error in userQuery function:", error)
      return res.status(400).send({ status: 400, error: `Error in userQuery function: ${error}` })
    }
  },

  async getPendingQueriesResponse(req, res) {
    try {
      const { id: userId } = req.user;

      let order = await orderDao.findAll({ userId });
      order = order.map(order => order.toJSON());
      return res.status(200).send({ status: 200, data: order });
    } catch (error) {
      console.log("error in getPendingQueriesResponse function:", error);
      return res.status(400).send({ status: 400, error: `Error in getPendingQueriesResponse function: ${error}` })
    }
  }
}

module.exports = QueryController;
