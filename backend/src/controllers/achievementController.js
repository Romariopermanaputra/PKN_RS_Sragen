const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadFileToSupabase, deleteFileFromSupabase } = require('../config/supabase');

exports.getAll = async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil prestasi' });
  }
};

exports.create = async (req, res) => {
  try {
    const { judul, deskripsi, tahun } = req.body;
    let gambar = null;
    if (req.file) {
      gambar = await uploadFileToSupabase(req.file);
    }

    const achievement = await prisma.achievement.create({
      data: { judul, deskripsi, tahun: tahun ? Number(tahun) : null, gambar },
    });
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menambah prestasi' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, deskripsi, tahun } = req.body;

    const existingAchievement = await prisma.achievement.findUnique({
      where: { id: Number(id) }
    });

    if (!existingAchievement) {
      return res.status(404).json({ message: 'Prestasi tidak ditemukan' });
    }

    const data = { judul, deskripsi, tahun: tahun ? Number(tahun) : undefined };
    
    if (req.file) {
      data.gambar = await uploadFileToSupabase(req.file);
      if (existingAchievement.gambar) {
        await deleteFileFromSupabase(existingAchievement.gambar);
      }
    }

    const achievement = await prisma.achievement.update({ where: { id: Number(id) }, data });
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate prestasi' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existingAchievement = await prisma.achievement.findUnique({
      where: { id: Number(id) }
    });

    if (!existingAchievement) {
      return res.status(404).json({ message: 'Prestasi tidak ditemukan' });
    }

    await prisma.achievement.delete({ where: { id: Number(id) } });

    if (existingAchievement.gambar) {
      await deleteFileFromSupabase(existingAchievement.gambar);
    }

    res.json({ message: 'Prestasi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus prestasi' });
  }
};
