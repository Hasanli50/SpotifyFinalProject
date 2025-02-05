const { body, param, validationResult } = require("express-validator");

const updateArtistInfoValidator = [
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

  body("genreIds")
    .optional() 
    .isArray()
    .withMessage("genreIds must be an array.")
    .custom((value) => {
      if (value && value.length > 0) {
        const isValid = value.every((id) => {
          return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id); // Validates that each genreId is a valid MongoDB ObjectId
        });
        if (!isValid) {
          throw new Error("All genre IDs must be valid MongoDB ObjectIds.");
        }
      }
      return true;
    }),

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

module.exports = updateArtistInfoValidator;
