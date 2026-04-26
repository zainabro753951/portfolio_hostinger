// ✅ Utils/multer.js - Updated
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // ✅ 5MB se 10MB kar diya (PDFs bade hote hain)
  },
  fileFilter: (req, file, cb) => {
    // ✅ Koi bhi file accept karo - no restriction
    cb(null, true);
  },
});

export default upload;
