const express = require("express");
const router = express.Router();
const middleware = require("../Utils/middleware");

const AuthController = require("../Controllers/Auth/AuthController");

router.post("/login", AuthController.login);
router.post("/create-account", AuthController.createAccount);

router.get("/profile", middleware.authenticate, AuthController.getProfile);
router.put("/profile/:id", middleware.authenticate, AuthController.updateProfile);

router.post("/add-address", middleware.authenticate, AuthController.saveAddress);

module.exports = router
