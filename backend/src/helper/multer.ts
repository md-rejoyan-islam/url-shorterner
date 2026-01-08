import fs from "fs";
import multer from "multer";
import path from "path";

const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 0.5 * 1024 * 1024; // 0.5 MB

// Ensure upload directory exists
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Avatar upload middleware
const avatarUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadPath = path.join(process.cwd(), "src/public/avatars");
      ensureDir(uploadPath);
      cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `avatar-${uniqueSuffix}${ext}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (SUPPORTED_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Only jpeg, png, gif, webp are allowed.`));
    }
  },
});

export { avatarUpload, MAX_FILE_SIZE };
