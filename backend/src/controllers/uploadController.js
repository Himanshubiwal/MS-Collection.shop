import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage engine configuration (100% Free local storage option)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Clean file name and append timestamp to prevent overwrites
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `mscollection_${baseName}_${Date.now()}${ext}`);
  },
});

// File filter to allow images only
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|avif|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (JPG, JPEG, PNG, WEBP, AVIF, GIF) are allowed'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload single or multiple images locally and return accessible URL paths
// @route   POST /api/upload
// @access  Private/Admin
export const handleUpload = (req, res) => {
  if (!req.files && !req.file) {
    res.status(400);
    throw new Error('No image file provided for upload');
  }

  const files = req.files || [req.file];
  const fileUrls = files.map(file => {
    // Construct local public URL accessible from Express static middleware
    return `/uploads/${file.filename}`;
  });

  res.json({
    success: true,
    message: 'Images uploaded successfully to free storage',
    urls: fileUrls,
    url: fileUrls[0], // Convenience single url field
  });
};
