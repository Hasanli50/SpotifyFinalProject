const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  register,
  verifyAccount,
  login,
} = require("../controllers/userController.js");
const validateRegistration = require("../middlewares/registerValidator.js");
const verifyToken = require("../middlewares/verifyToken.js");
const verifyRoles = require("../middlewares/verifyRoles.js");

router.get("/", verifyToken, verifyRoles("admin"),getAll);
router.get("/:id", getById);
router.post("/register", validateRegistration, register);
router.get("/verify/:id", verifyAccount)
router.post("/login", login);

module.exports = router;
