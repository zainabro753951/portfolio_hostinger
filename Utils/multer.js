import multer from "multer";

// ❌ Purana DiskStorage wala code hata dein
// ✅ MemoryStorage use karein taake file disk par auto-save na ho
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"), false);
    }
  },
});

export default upload;
