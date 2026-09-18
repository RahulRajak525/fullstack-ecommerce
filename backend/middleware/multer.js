import multer from "multer";
import path from "path";
import os from "os";

const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: function (req, file, callback) {
    // Never trust originalname for the path - it can contain "../".
    // Keep only the extension and generate the rest ourselves.
    const ext = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 4 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed"));
    }
    callback(null, true);
  },
});

export default upload;
