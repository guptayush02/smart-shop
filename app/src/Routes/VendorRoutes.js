const express = require("express");
const router = express.Router();

const middleware = require("../Utils/middleware");

const QueryController = require("../Controllers/Vendor/QueryController");
const VendorController = require("../Controllers/Vendor/VendorController");

// 2
router.get("/get-vendor-query", middleware.authenticate, QueryController.getQueryForVendor);

// 3
router.post("/vendor-query-response", middleware.authenticate, QueryController.vendorResponseOnQuery);

router.get("/categories", middleware.authenticate, VendorController.getCategories);
router.post("/category", middleware.authenticate, VendorController.saveVendorCatrgory);

module.exports = router
