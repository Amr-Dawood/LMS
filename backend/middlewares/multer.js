// middlewares/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image");
    const isVideo = file.mimetype.startsWith("video");

    if (isImage) {
      cb(null, 'uploads/images/');
    } else if (isVideo) {
      cb(null, 'uploads/videos/');
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

module.exports = upload;
