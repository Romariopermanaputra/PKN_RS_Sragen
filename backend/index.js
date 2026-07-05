const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs'); // ✅ TAMBAHKAN INI

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ DEBUG: Cek folder uploads saat startup
const uploadsPath = path.join(__dirname, 'uploads');
console.log('📁 Uploads path:', uploadsPath);
console.log('📁 Folder exists:', fs.existsSync(uploadsPath));
if (fs.existsSync(uploadsPath)) {
  const files = fs.readdirSync(uploadsPath);
  console.log('📁 Files in uploads:', files);
}

app.use(cors({
  origin: [
    'https://pkn-rs-sragen.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// ✅ DEBUG: Log setiap request ke /uploads
app.use('/uploads', (req, res, next) => {
  console.log('🖼️ Request to uploads:', req.path);
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', require('./src/routes/public'));
app.use('/api/admin', require('./src/routes/admin'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
}

module.exports = app;