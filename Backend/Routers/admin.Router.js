const express = require("express");
const adminController = require("../Controllers/admin.Controller");
const authMiddleware = require("../Middleware/auth.Middleware");
const router = express.Router();

router.get("/getAllusers", authMiddleware.authMiddleware, authMiddleware.isadminmiddleware,authMiddleware.isactiveMiddleware, adminController.getAllusersBypagintion);

router.patch("/users/:id/activate", authMiddleware.authMiddleware, authMiddleware.isadminmiddleware,authMiddleware.isactiveMiddleware, adminController.activateUsers);

router.patch("/users/:id/deactivate", authMiddleware.authMiddleware, authMiddleware.isadminmiddleware,authMiddleware.isactiveMiddleware, adminController.deactivateUsers);

module.exports = router;
