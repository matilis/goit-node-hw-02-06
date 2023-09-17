const multer = require("multer");

const storageImage = multer.diskStorage({
  destination: "tmp",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const originalExtension = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + originalExtension);
  },
});

const uploadImage = multer({ storage: storageImage });

module.exports = {
  uploadImage,
};
