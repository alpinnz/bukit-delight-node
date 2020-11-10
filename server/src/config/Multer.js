const multer = require("multer");
const path = require("path");

const pathUploads = path.join(process.cwd(), process.env.PATH_UPLOADS);
console.log("pathUploads", pathUploads);
const storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, pathUploads);
  },
  filename: function (req, file, cb) {
    const random = Math.floor(Math.random() * 123456789 + 1);
    const datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        random +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});
const uploadImage = multer({
  //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});
exports.uploadImage = uploadImage;
