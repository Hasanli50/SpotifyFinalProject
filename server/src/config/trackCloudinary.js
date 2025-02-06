const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const resourceType =
      file.mimetype.startsWith("image/") ? "image" : "raw";

    return {
      folder: "uploads",
      resource_type: resourceType, 
      allowed_formats: ["jpg", "png", "jpeg", "mp3", "wav"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, 
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};
