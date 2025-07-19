const express = require("express");
const router = express.Router();

const middleware = require("../Utils/middleware");

const QueryController = require("../Controllers/DeliveryPartner/QueryController");

router.get("/get-query", middleware.authenticate, QueryController.getQuery);

module.exports = router
