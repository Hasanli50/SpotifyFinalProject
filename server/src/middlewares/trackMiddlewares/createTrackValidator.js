const { body, validationResult } = require("express-validator");
const path = require("path");

const createTrackValidator = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),
  body("artistId")
    .isMongoId()
    .withMessage("Artist ID must be a valid MongoDB ID"),
  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),
  body("genreId")
    .isMongoId()
    .withMessage("Genre ID must be a valid MongoDB ID"),
  body("type")
    .isIn(["single", "album"])
    .withMessage('Type must be either "single" or "album"'),
  body("premiumOnly")
    .optional()
    .isBoolean()
    .withMessage("Premium Only must be a boolean value"),
  body("collaboratedArtistIds")
    .optional()
    .isArray()
    .withMessage("Collaborated Artist IDs must be an array"),

  // Validate coverImage file type (must be PNG)
  body("coverImage").custom((value, { req }) => {
    if (!req.files || !req.files.coverImage) {
      throw new Error("Image is required");
    }

    const fileExtension = path
      .extname(req.files.coverImage[0].originalname)
      .toLowerCase();
    if (![".png", ".jpeg", ".jpg", ".gif"].includes(fileExtension)) {
      throw new Error("Cover image must be a PNG, JPEG, JPG, or GIF file");
    }
    return true;
  }),

  // Validate previewUrl file type (must be audio)
  body("previewUrl").custom((value, { req }) => {
    if (!req.files || !req.files.previewUrl) {
      throw new Error("Audio is required");
    }

    const fileExtension = path
      .extname(req.files.previewUrl[0].originalname)
      .toLowerCase();
    if (![".mp3", ".wav"].includes(fileExtension)) {
      throw new Error("Preview file must be an audio file (.mp3, .wav)");
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

module.exports = createTrackValidator;
