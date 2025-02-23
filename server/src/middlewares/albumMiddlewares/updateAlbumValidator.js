const { body, param, validationResult } = require("express-validator");

const updateAlbumValidatiion = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("coverImage").custom((value, { req }) => {
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

module.exports = updateAlbumValidatiion;
