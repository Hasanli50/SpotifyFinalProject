const express = require("express");
const router = express.Router();
const {
  getAllNonDeletedUsers,
  getAllDeletedUsers,
  getById,
  register,
  login,
  verifyAccount,
  deleteAccount,
  freezeAccount,
  unfreezeAccount,
  banAccount,
  unBanAccount,
  resetPassword,
  forgotPassword,
  updateUserInfo,
  updatePassword,
} = require("../controllers/userController.js");
const validateRegistration = require("../middlewares/registerValidator.js");
const verifyToken = require("../middlewares/verifyToken.js");
const verifyRoles = require("../middlewares/verifyRoles.js");
const validateLogin = require("../middlewares/loginValidator.js");
const banAccountValidation = require("../middlewares/banAccountValidator.js");
const updatePasswordValidator = require("../middlewares/updatePassValidator.js");
const resetPasswordValidator = require("../middlewares/resetPassValidator.js");
const updateUserInfoValidator = require("../middlewares/updateUserInfo.js");
const validateForgotPassword = require("../middlewares/forgotPassValidator.js");

router.get(
  "/nonDeletedUsers",
  verifyToken,
  verifyRoles("admin", "user"),
  getAllNonDeletedUsers
);
router.get(
  "/deletedUsers",
  verifyToken,
  verifyRoles("admin", "user"),
  getAllDeletedUsers
);
router.get("/:id", verifyToken, getById);
router.post("/register", validateRegistration, register);
router.get("/verify/:token", verifyAccount);
router.post("/login", validateLogin, login);
router.post("/forgot-password", validateForgotPassword,forgotPassword);
router.post(
  "/reset-password/:token",
  verifyToken,
  resetPasswordValidator,
  resetPassword
);
router.patch(
  "/update-info/:id",
  verifyToken,
  updateUserInfoValidator,
  updateUserInfo
);
router.delete("/delete-account/:id", verifyToken, deleteAccount);

router.patch(
  "/freeze-account/:id",
  verifyToken,
  verifyRoles("user"),
  freezeAccount
);

router.patch(
  "/unfreeze-account/:id",
  verifyToken,
  verifyRoles("user"),
  unfreezeAccount
);

router.patch(
  "/ban-account/:id",
  verifyToken,
  verifyRoles("admin"),
  banAccountValidation,
  banAccount
);

router.patch(
  "/unban-account/:id",
  verifyToken,
  verifyRoles("admin"),
  unBanAccount
);

router.patch(
  "/update-password/:id",
  verifyToken,
  updatePasswordValidator,
  updatePassword
);
module.exports = router;
