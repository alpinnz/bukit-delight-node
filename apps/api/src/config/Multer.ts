import multer from "multer";
import path from "path";

const pathUploads = path.join(
  process.cwd(),
  process.env.PATH_UPLOADS || "public/uploads",
);
const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, pathUploads);
  },
  filename: (_request, file, callback) => {
    const random = Math.floor(Math.random() * 123456789 + 1);
    const datetimestamp = Date.now();
    const extension = file.originalname.split(".").pop();
    callback(null, `${file.fieldname}-${random}-${datetimestamp}.${extension}`);
  },
});

const uploadImage = multer({
  storage,
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (![".png", ".jpg", ".gif", ".jpeg"].includes(extension)) {
      callback(new Error("Only images are allowed"));
      return;
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

export = { uploadImage, none: multer().none() };
