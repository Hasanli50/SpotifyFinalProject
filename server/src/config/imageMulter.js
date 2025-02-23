const multer = require("multer");
const path = require("path");
const { storage: cloudinaryStorage } = require("./imageCloudinary.js");

const imageUpload = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      return cb(
        new Error("Only images are allowed with file types jpeg, jpg, png, gif")
      );
    }
  },
});

module.exports = imageUpload