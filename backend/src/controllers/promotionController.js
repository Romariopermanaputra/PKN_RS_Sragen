const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// Folder tempat menyimpan gambar (sesuaikan dengan konfigurasi multer Anda)
const UPLOAD_DIR = path.join(__dirname, '../uploads');

const parseDate = (value) => {
  if (!value || value === '') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parseEndDate = (value) => {
  const date = parseDate(value);
  if (!date) return null;
  date.setHours(23, 59, 59, 999);
  return date;
};

// Helper untuk menghapus file gambar dari server
const deleteImageFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(UPLOAD_DIR, filename);
  fs.unlink(filePath, (err) => {
    if (err) console.error('Gagal menghapus file gambar:', err);
  });
};

exports.getAllActive = async (req, res) => {
  try {
    const promotions = await prisma.promotion.findMany({
      where: {
        tanggal_berakhir: { gte: new Date() },
      },
      orderBy: { tanggal_mulai: 'desc' },
    });
    res.json(promotions);
  } catch (error) {
    console.error('Error fetching active promotions:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengambil promo',
      error: error.message 
    });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { tanggal_mulai: 'desc' },
    });
    res.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengambil promo',
      error: error.message 
    });
  }
};

exports.create = async (req, res) => {
  try {
    // 🔍 [DEBUGGING] Intip apa yang diterima backend
    console.log('\n--- 🔍 [DEBUG] CREATE PROMOTION ---');
    console.log('📦 Request Body:', req.body);
    console.log('🖼️ Request File:', req.file);
    console.log('------------------------------------\n');

    const { judul, deskripsi, tanggal_mulai, tanggal_berakhir } = req.body;
    const gambar = req.file ? req.file.filename : null;

    // Validasi field wajib
    if (!judul || judul.trim() === '') {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(400).json({ message: 'Judul promo wajib diisi' });
    }

    // Parse tanggal dengan aman
    const tglMulai = parseDate(tanggal_mulai);
    const tglBerakhir = parseEndDate(tanggal_berakhir);

    // 🔍 [DEBUGGING] Lihat data yang akan disimpan
    console.log('💾 Data yang akan di-SAVE:', {
      judul: judul.trim(),
      deskripsi: deskripsi ? deskripsi.trim() : null,
      gambar,
      tanggal_mulai: tglMulai,
      tanggal_berakhir: tglBerakhir,
    });

    const promotion = await prisma.promotion.create({
      data: {
        judul: judul.trim(),
        deskripsi: deskripsi ? deskripsi.trim() : null,
        gambar,
        tanggal_mulai: tglMulai,
        tanggal_berakhir: tglBerakhir,
      },
    });

    res.status(201).json(promotion);
  } catch (error) {
    console.error('❌ Error creating promotion:', error);
    
    // Jika gagal, hapus file yang sudah terlanjur diupload
    if (req.file) deleteImageFile(req.file.filename);
    
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menambah promo',
      error: error.message, // ✅ Detail error untuk debugging
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.update = async (req, res) => {
  try {
    // 🔍 [DEBUGGING] Intip apa yang diterima backend
    console.log('\n--- 🔍 [DEBUG] UPDATE PROMOTION ---');
    console.log('📦 Request Body:', req.body);
    console.log('🖼️ Request File:', req.file);
    console.log('------------------------------------\n');

    const { id } = req.params;
    const { judul, deskripsi, tanggal_mulai, tanggal_berakhir } = req.body;
    const gambarBaru = req.file ? req.file.filename : undefined;

    const data = {};
    if (judul !== undefined && judul.trim() !== '') data.judul = judul.trim();
    if (deskripsi !== undefined) data.deskripsi = deskripsi.trim();
    if (tanggal_mulai !== undefined && tanggal_mulai !== '') {
      data.tanggal_mulai = parseDate(tanggal_mulai);
    }
    if (tanggal_berakhir !== undefined && tanggal_berakhir !== '') {
      data.tanggal_berakhir = parseEndDate(tanggal_berakhir);
    }
    if (gambarBaru) data.gambar = gambarBaru;

    // 🔍 [DEBUGGING] Lihat data yang akan di-update
    console.log('💾 Data yang akan di-UPDATE:', data);

    // Cegah update dengan data kosong
    if (Object.keys(data).length === 0) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(400).json({ message: 'Tidak ada data yang diupdate' });
    }

    // Ambil data lama untuk keperluan hapus file gambar lama
    const oldPromotion = await prisma.promotion.findUnique({
      where: { id: Number(id) },
    });

    if (!oldPromotion) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }

    // Lakukan update
    const promotion = await prisma.promotion.update({
      where: { id: Number(id) },
      data,
    });

    // Hapus gambar lama jika ada gambar baru yang diupload
    if (gambarBaru && oldPromotion.gambar) {
      deleteImageFile(oldPromotion.gambar);
    }

    res.json(promotion);
  } catch (error) {
    console.error('❌ Error updating promotion:', error);

    // Cleanup file jika update gagal
    if (req.file) deleteImageFile(req.file.filename);

    // Error Prisma: Record not found
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }

    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengupdate promo',
      error: error.message, // ✅ Detail error untuk debugging
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil data promo untuk mengetahui nama file gambar
    const promotion = await prisma.promotion.findUnique({
      where: { id: Number(id) },
    });

    if (!promotion) {
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }

    // Hapus data dari database
    await prisma.promotion.delete({ where: { id: Number(id) } });

    // Hapus file gambar dari server jika ada
    if (promotion.gambar) {
      deleteImageFile(promotion.gambar);
    }

    res.json({ message: 'Promo berhasil dihapus' });
  } catch (error) {
    console.error('❌ Error deleting promotion:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }

    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menghapus promo',
      error: error.message // ✅ Detail error untuk debugging
    });
  }
};