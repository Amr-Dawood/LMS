const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("File received:", file);
        cb(null, 'uploads/'); // Ensure 'uploads/' exists
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Get file extension
        const filename = `${file.fieldname}-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

// File filter (allow images & videos)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/mkv', 'video/webm'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error("Only images and videos are allowed!"), false);
    }
};

// Initialize Multer
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // Limit file size to 50MB
});

module.exports = upload;
