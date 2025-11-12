const multer = require("multer");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Debug Cloudinary configuration
console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY ,
  api_secret: process.env.API_SECRET ,
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = new multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

async function imageUploadUtil(file) {
  try {
    console.log("Uploading to Cloudinary...");
    
    // For base64 strings (from your controller), use simple upload
    const uploadOptions = {
      resource_type: "auto", // Auto-detect image type
      quality: "auto",
      fetch_format: "auto",
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);
    console.log("Cloudinary upload successful:", result.url);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`File upload failed: ${error.message}`);
  }
}

module.exports = { 
  upload, 
  imageUploadUtil
};