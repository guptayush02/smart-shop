const middleware = require("../Utils/middleware");
const express = require("express");
const router = express.Router();

const QueryController = require("../Controllers/User/QueryController");
const OrderController = require("../Controllers/Order/OrderController");
const UserController = require("../Controllers/User/UserController");

// 1
router.post("/send-query", middleware.authenticate, QueryController.userQuery);

// 4
router.get("/get-pending-queries", middleware.authenticate, QueryController.getPendingQueriesResponse);

// 5
router.post("/order-place", middleware.authenticate, OrderController.placeOrder);

module.exports = router
