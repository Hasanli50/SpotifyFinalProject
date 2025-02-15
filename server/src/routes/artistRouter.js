const express = require("express");
const router = express.Router();
const {
  getAllNonDeletedArtists,
  getAllDeletedArtists,
  getAllPendingStatus,
  getById,
  register,
  login,
  verifyAccount,
  deleteAccount,
  freezeAccount,
  unfreezeAccount,
  getByToken,
  banAccount,
  unBanAccount,
  resetPassword,
  forgotPassword,
  updateArtistInfo,
  updatePassword,
} = require("../controllers/artistController.js");
const validateRegistration = require("../middlewares/artistMiddlewares/registerValidator.js");
const {verifyTokenArtist} = require("../middlewares/verifyToken.js");
const {verifyRoleArtist} = require("../middlewares/verifyRoles.js");
const validateLogin = require("../middlewares/artistMiddlewares/loginValidator.js");
const banAccountValidation = require("../middlewares/artistMiddlewares/banAccountValidator.js");
const updatePasswordValidator = require("../middlewares/artistMiddlewares/updatePassValidator.js");
const resetPasswordValidator = require("../middlewares/artistMiddlewares/resetPassValidator.js");
const updateArtistInfoValidator = require("../middlewares/artistMiddlewares/updateArtistInfo.js");
const validateForgotPassword = require("../middlewares/artistMiddlewares/forgotPassValidator.js");
const imageUpload = require("../config/imageMulter.js");

router.get(
  "/nonDeletedArtists",
  // verifyTokenArtist,
  // verifyRoleArtist("admin", "artist"),
  getAllNonDeletedArtists 
);
router.get(
  "/deletedArtists",
  verifyTokenArtist,
  verifyRoleArtist("admin", "artist"),
  getAllDeletedArtists
);
router.get(
  "/pendingStatus",
  verifyTokenArtist,
  verifyRoleArtist("admin", "artist"),
  getAllPendingStatus
);
router.get("/token", verifyTokenArtist, getByToken);
router.get("/:id", verifyTokenArtist, getById);
router.post(
  "/register",
  imageUpload.single("image"),
  validateRegistration,
  register
);
router.get("/verify/:id", verifyAccount);
router.post("/login", validateLogin, login);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post(
  "/reset-password/:token",
  verifyTokenArtist,
  resetPasswordValidator,
  resetPassword
);
router.patch(
  "/update-info/:id",
  verifyTokenArtist,
  imageUpload.single("image"),
  // updateArtistInfoValidator,
  updateArtistInfo
);
router.delete("/delete-account/:id", verifyTokenArtist, deleteAccount);

router.patch(
  "/freeze-account/:id",
  verifyTokenArtist,
  verifyRoleArtist("artist"),
  freezeAccount
);

router.patch(
  "/unfreeze-account/:id",
  verifyTokenArtist,
  verifyRoleArtist("artist"),
  unfreezeAccount
);

router.patch(
  "/ban-account/:id",
  verifyTokenArtist,
  verifyRoleArtist("admin", "artist"),
  banAccountValidation,
  banAccount
);

router.patch(
  "/unban-account/:id",
  verifyTokenArtist,
  verifyRoleArtist("admin", "artist"),
  unBanAccount
);

router.patch(
  "/update-password/:id",
  verifyTokenArtist,
  updatePasswordValidator,
  updatePassword
);

module.exports = router;
