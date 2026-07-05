const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ✅ Tambahkan ini

// ✅ Auto-create folder uploads jika belum ada
const uploadDir = process.env.VERCEL || process.env.NODE_ENV === 'production' 
  ? '/tmp' 
  : path.join(__dirname, '../../uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Folder uploads dibuat otomatis di ' + uploadDir);
  }
} catch (err) {
  console.warn('⚠️ Gagal membuat folder uploads. Mengabaikan...');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Hanya file gambar yang diizinkan'));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });