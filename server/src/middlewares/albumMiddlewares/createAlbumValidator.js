const { body, validationResult } = require("express-validator");

const createAlbumValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("artistId")
    .notEmpty()
    .withMessage("Artist ID cannot be empty.")
    .isMongoId()
    .withMessage("Artist ID must be a valid MongoDB ID"),

  
  body("coverImage").custom((value, { req }) => {
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

module.exports = createAlbumValidation;
