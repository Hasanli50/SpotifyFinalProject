const { body, validationResult, check } = require("express-validator");
const User = require("../../models/user");

const createPlaylistWithCollaboratorsValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),

  body("collaborators")
    .isArray()
    .withMessage("Collaborators must be an array")
    .notEmpty()
    .custom(async (value) => {
      for (const collaboratorId of value) {
        if (!collaboratorId.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error(
            `Collaborator ID ${collaboratorId} is not a valid ObjectId`
          );
        }
        const collaborator = await User.findById(collaboratorId);
        if (!collaborator) {
          throw new Error(`Collaborator with ID ${collaboratorId} not found`);
        }
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

module.exports = createPlaylistWithCollaboratorsValidation;
