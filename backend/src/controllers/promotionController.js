const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadFileToSupabase, deleteFileFromSupabase } = require('../config/supabase');

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
    const { judul, deskripsi, tanggal_mulai, tanggal_berakhir } = req.body;
    let gambar = null;

    if (!judul || judul.trim() === '') {
      return res.status(400).json({ message: 'Judul promo wajib diisi' });
    }

    if (req.file) {
      gambar = await uploadFileToSupabase(req.file);
    }

    const tglMulai = parseDate(tanggal_mulai);
    const tglBerakhir = parseEndDate(tanggal_berakhir);

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
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menambah promo',
      error: error.message, 
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, deskripsi, tanggal_mulai, tanggal_berakhir } = req.body;

    const data = {};
    if (judul !== undefined && judul.trim() !== '') data.judul = judul.trim();
    if (deskripsi !== undefined) data.deskripsi = deskripsi.trim();
    if (tanggal_mulai !== undefined && tanggal_mulai !== '') {
      data.tanggal_mulai = parseDate(tanggal_mulai);
    }
    if (tanggal_berakhir !== undefined && tanggal_berakhir !== '') {
      data.tanggal_berakhir = parseEndDate(tanggal_berakhir);
    }

    const oldPromotion = await prisma.promotion.findUnique({
      where: { id: Number(id) },
    });

    if (!oldPromotion) {
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }

    if (req.file) {
      data.gambar = await uploadFileToSupabase(req.file);
      if (oldPromotion.gambar) {
        await deleteFileFromSupabase(oldPromotion.gambar);
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Tidak ada data yang diupdate' });
    }

    const promotion = await prisma.promotion.update({
      where: { id: Number(id) },
      data,
    });

    res.json(promotion);
  } catch (error) {
    console.error('❌ Error updating promotion:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengupdate promo',
      error: error.message, 
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await prisma.promotion.findUnique({
      where: { id: Number(id) },
    });

    if (!promotion) {
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }

    await prisma.promotion.delete({ where: { id: Number(id) } });

    if (promotion.gambar) {
      await deleteFileFromSupabase(promotion.gambar);
    }

    res.json({ message: 'Promo berhasil dihapus' });
  } catch (error) {
    console.error('❌ Error deleting promotion:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menghapus promo',
      error: error.message 
    });
  }
};