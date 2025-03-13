const { body, param, validationResult } = require("express-validator");

const updateUserInfoValidator = [
  param("id").isMongoId().withMessage("Invalid user ID format"),

  body("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long.")
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),

    body("image").custom((value, { req }) => {
      if (req.file && !req.file.mimetype.match(/^image\//)) {
        throw new Error("Uploaded file is not an image");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Validation failed",
        status: "fail",
      });
    }
    next();
  },
];

module.exports = updateUserInfoValidator;
