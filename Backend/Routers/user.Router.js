const express = require("express");
const router = express.Router();

const userController = require("../Controllers/user.Controller");
const {authMiddleware,isactiveMiddleware} = require("../Middleware/auth.Middleware");

router.get("/profile", authMiddleware , isactiveMiddleware , userController.getUserProfile);

router.patch("/profile", authMiddleware , isactiveMiddleware , userController.updateUserProfile);

router.patch("/changepassword", authMiddleware , isactiveMiddleware , userController.ChangePassword);


module.exports = router;