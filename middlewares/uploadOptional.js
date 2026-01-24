import multer from 'multer'
const upload = multer()

// 🧩 Hybrid middleware for optional file uploads
export const uploadOptional = (req, res, next) => {
  const multipartUpload = upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'ogProjectImage', maxCount: 1 },
    { name: 'gallery', maxCount: 12 },
  ])

  multipartUpload(req, res, err => {
    if (err) return next(err)

    // ✅ If no files, ensure req.body is parsed too
    if (!req.files || Object.keys(req.files).length === 0) {
      upload.none()(req, res, next)
    } else {
      next()
    }
  })
}
