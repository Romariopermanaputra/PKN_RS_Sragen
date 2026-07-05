const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ✅ Tambahkan ini

// Menggunakan memory storage agar kompatibel dengan Vercel (read-only FS)
// dan langsung mengunggah buffer ke Supabase.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Hanya file gambar yang diizinkan'));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });