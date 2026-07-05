const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadFileToSupabase, deleteFileFromSupabase } = require('../config/supabase');

exports.getAll = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { tanggal: 'desc' },
    });
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengambil berita',
      error: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await prisma.news.findUnique({
      where: { id: Number(id) },
    });

    if (!news) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    res.json(news);
  } catch (error) {
    console.error('Error fetching news detail:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengambil detail berita',
      error: error.message 
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { judul, isi } = req.body;
    let gambar = null;

    if (req.file) {
      gambar = await uploadFileToSupabase(req.file);
    }

    const news = await prisma.news.create({
      data: { judul, isi, gambar },
    });

    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menambah berita',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, isi } = req.body;

    const existingNews = await prisma.news.findUnique({
      where: { id: Number(id) },
    });

    if (!existingNews) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    const data = {};
    if (judul !== undefined) data.judul = judul;
    if (isi !== undefined) data.isi = isi;
    
    if (req.file) {
      data.gambar = await uploadFileToSupabase(req.file);
      if (existingNews.gambar) {
        await deleteFileFromSupabase(existingNews.gambar);
      }
    }

    const news = await prisma.news.update({
      where: { id: Number(id) },
      data,
    });

    res.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengupdate berita',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingNews = await prisma.news.findUnique({
      where: { id: Number(id) },
    });

    if (!existingNews) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    await prisma.news.delete({ where: { id: Number(id) } });
    
    if (existingNews.gambar) {
      await deleteFileFromSupabase(existingNews.gambar);
    }

    res.json({ message: 'Berita berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menghapus berita',
      error: error.message 
    });
  }
};