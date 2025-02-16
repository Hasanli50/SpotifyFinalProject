const express = require("express");
const router = express.Router();
const {
  getAllNonDeletedUsers,
  getAllDeletedUsers,
  getById,
  getByToken,
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
const validateRegistration = require("../middlewares/userMiddlewares/registerValidator.js");
const {verifyToken} = require("../middlewares/verifyToken.js");
const {verifyRoles} = require("../middlewares/verifyRoles.js");
const validateLogin = require("../middlewares/userMiddlewares/loginValidator.js");
const banAccountValidation = require("../middlewares/userMiddlewares/banAccountValidator.js");
const updatePasswordValidator = require("../middlewares/userMiddlewares/updatePassValidator.js");
const resetPasswordValidator = require("../middlewares/userMiddlewares/resetPassValidator.js");
const updateUserInfoValidator = require("../middlewares/userMiddlewares/updateUserInfo.js");
const validateForgotPassword = require("../middlewares/userMiddlewares/forgotPassValidator.js");
const imageUpload = require("../config/imageMulter.js");

router.get(
  "/nonDeletedUsers",
  // verifyToken,
  // verifyRoles("admin", "user"),
  getAllNonDeletedUsers
);
router.get(
  "/deletedUsers",
  verifyToken,
  verifyRoles("admin", "user"),
  getAllDeletedUsers
);
router.get("/:token", verifyToken, getByToken);
router.get("/:id", verifyToken, getById);
router.post(
  "/register",
  imageUpload.single("image"),
  validateRegistration,
  register
);
router.get("/verify/:token", verifyAccount);
router.post("/login", validateLogin, login);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post(
  "/reset-password/:token",
  verifyToken,
  resetPasswordValidator,
  resetPassword
);
router.patch(
  "/update-info/:id",
  verifyToken,
  imageUpload.single("image"),
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

// Profile Route
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("/profile", { user: req.user });
});

// Logout Route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
