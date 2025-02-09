const { body, validationResult } = require("express-validator");

const validateRegistration = [
  body("username")
    .notEmpty()
    .withMessage("Username cannot be empty.")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long.")
    .trim(),

  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .trim(),

  body("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image is required");
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

module.exports = validateRegistration;
