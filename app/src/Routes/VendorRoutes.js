const express = require("express");
const router = express.Router();

const middleware = require("../Utils/middleware");

const QueryController = require("../Controllers/Vendor/QueryController");

// 2
router.get("/get-vendor-query", middleware.authenticate, QueryController.getQueryForVendor);

// 3
router.post("/vendor-query-response", middleware.authenticate, QueryController.vendorResponseOnQuery);

module.exports = router
