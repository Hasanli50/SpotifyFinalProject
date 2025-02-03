const multer = require("multer");

function multerErrorHandling(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }
  next();
}

module.exports = multerErrorHandling;