// const path = require("path");
// const multer = require("multer");

// const uploadDir = path.join(process.cwd(), "tmp");
// const createPublic = path.join(process.cwd(), "public");
// const storeImage = path.join(createPublic, "avatars");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
//   limits: {
//     fileSize: 1048576,
//   },
// });

// const uploadAvatar = multer({
//   storage: storage,
// });
// module.exports = { uploadAvatar, uploadDir, createPublic, storeImage };

const multer = require("multer");

const storageImage = multer.diskStorage({
  destination: "tmp",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const originalExtension = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + originalExtension);
  },
});

const uploadImage = multer({
  storage: storageImage,
});
module.exports = { uploadImage };
