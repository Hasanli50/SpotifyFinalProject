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

  body("image").optional().isURL().withMessage("Image must be a valid URL"),

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
