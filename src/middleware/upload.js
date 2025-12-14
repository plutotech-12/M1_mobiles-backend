const multer = require("multer");

// We use memory storage because Cloudinary upload_stream requires file.buffer
const storage = multer.memoryStorage();

module.exports = multer({ storage });
