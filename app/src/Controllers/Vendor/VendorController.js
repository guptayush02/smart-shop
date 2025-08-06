const orderDAO = require("../../../database/orderDAO");
const vendorCategoryDAO = require("../../../database/vendorCategoryDAO");
const profileDao = require("../../../database/profileDAO");

const VendorController = {

  async getCategories(req, res) {
    try {
      const { category } = req.query;
      let [orderCategories, vendorCategory] = await Promise.all([orderDAO.findAllCategories(category), vendorCategoryDAO.findAllCategories(category)]);

      orderCategories = orderCategories.map((item) => item.category);
      vendorCategory = vendorCategory.map((item) => item.category);
      const combinedUniqueCategories = [
        ...new Set([
          ...orderCategories,
          ...vendorCategory
        ])
      ];
      return res.status(200).send({status: 200, data: combinedUniqueCategories})
    } catch (error) {
      console.log("error in getQueryForVendor function:", error)
      return res.status(400).send({ status: 400, message: `Error in getQueryForVendor function: ${error}` });
    }
  },

  async saveVendorCatrgory(req, res) {
    try {
      const { user } = req;
      const { item: category } = req.body;

      if (user.role === 'vendor') {
        const exist = await vendorCategoryDAO.findOne({ vendorId: user?.id });
        if (exist) {
          await vendorCategoryDAO.update({ category }, { vendorId: user?.id });
        } else {
          await vendorCategoryDAO.create({ vendorId: user?.id, category });
        }
        return res.status(200).send({ status: 200, message: "Category saved successfully" });
      }
      return res.status(404).send({ status: 404, message: "You dont have valid permission to change category" });
    } catch (error) {
      console.log("error in saveVendorCatrgory function:", error)
      return res.status(400).send({ status: 400, message: `Error in saveVendorCatrgory function: ${error}` });
    }
  }
}

module.exports = VendorController;
