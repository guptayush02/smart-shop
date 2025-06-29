const express = require("express");
const router = express.Router();

const AuthController = require("../Controllers/Auth/AuthController");

router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);

module.exports = router
