const express = require("express");
const authController = require("../Controllers/auth.Controller");
const authMiddleware = require("../Middleware/auth.Middleware");
const router = express.Router();



router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout",authMiddleware.authMiddleware, authController.logout);


module.exports = router;



