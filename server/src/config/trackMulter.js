const multer = require("multer");
const { storage } = require("./trackCloudinary");

const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "audio/mpeg",
      "audio/wav",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only images (jpg, jpeg, png) and audio files (mp3, wav) are allowed."
        )
      );
    }
  },
});

module.exports = fileUpload;
