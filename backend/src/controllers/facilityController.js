const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadFileToSupabase, deleteFileFromSupabase } = require('../config/supabase');

const normalizeFacility = (facility) => ({
  id: facility.id_kamar ?? facility.id,
  id_kamar: facility.id_kamar ?? facility.id,
  nama: facility.nama_kamar ?? facility.nama ?? '',
  nama_kamar: facility.nama_kamar ?? facility.nama ?? '',
  deskripsi: facility.fasilitas ?? facility.deskripsi ?? '',
  fasilitas: facility.fasilitas ?? facility.deskripsi ?? '',
  gambar: facility.gambar_url ?? facility.gambar ?? null,
  gambar_url: facility.gambar_url ?? facility.gambar ?? null,
  harga_mulai: facility.harga_mulai ? Number(facility.harga_mulai) : null,
  jumlah_tersedia: facility.jumlah_tersedia ?? 0,
  status_aktif: facility.status_aktif ?? true,
});

const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'yes', 'on', 'aktif'].includes(String(value).toLowerCase());
};

const parseNumberOrNull = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

exports.getAll = async (req, res) => {
  try {
    const facilities = await prisma.tipe_kamar.findMany({
      orderBy: { id_kamar: 'desc' },
    });
    
    console.log('📊 Fetched facilities:', facilities.length);
    if (facilities.length > 0) {
      console.log('📸 Contoh gambar_url:', facilities[0].gambar_url);
    }
    
    res.json(facilities.map(normalizeFacility));
  } catch (error) {
    console.error('❌ Error fetching facilities:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil fasilitas' });
  }
};

// ✅ CREATE: Terima upload gambar fasilitas dengan logging lengkap
exports.create = async (req, res) => {
  try {
    console.log('\n=== CREATE FACILITY START ===');
    console.log('📁 req.file:', req.file ? { filename: req.file.filename, originalname: req.file.originalname } : null);
    console.log('📦 req.body:', req.body);
    
    const { nama, nama_kamar, deskripsi, fasilitas, harga_mulai, jumlah_tersedia, status_aktif } = req.body;
    
    // ✅ Ambil filename dari upload jika ada
    let gambar = null;
    if (req.file) {
      gambar = await uploadFileToSupabase(req.file);
    }
    
    console.log('🖼️ Gambar yang akan disimpan:', gambar);

    const facility = await prisma.tipe_kamar.create({
      data: {
        nama_kamar: nama || nama_kamar,
        fasilitas: deskripsi ?? fasilitas,
        gambar_url: gambar, // ✅ Akan tersimpan jika ada file
        harga_mulai: parseNumberOrNull(harga_mulai),
        jumlah_tersedia: parseNumberOrNull(jumlah_tersedia) ?? 0,
        status_aktif: parseBoolean(status_aktif, true),
      },
    });
    
    console.log('✅ Facility berhasil dibuat:', {
      id: facility.id_kamar,
      nama: facility.nama_kamar,
      gambar_url: facility.gambar_url
    });
    console.log('=== CREATE FACILITY END ===\n');
    
    res.status(201).json(normalizeFacility(facility));
  } catch (error) {
    console.error('❌ Error creating facility:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambah fasilitas' });
  }
};

// ✅ UPDATE: Terima upload gambar fasilitas dengan logging lengkap
exports.update = async (req, res) => {
  try {
    console.log('\n=== UPDATE FACILITY START ===');
    console.log('📁 req.file:', req.file ? { filename: req.file.filename } : null);
    console.log('📦 req.body:', req.body);
    
    const { id } = req.params;
    const { nama, nama_kamar, deskripsi, fasilitas, harga_mulai, jumlah_tersedia, status_aktif } = req.body;
    
    const oldFacility = await prisma.tipe_kamar.findUnique({
      where: { id_kamar: Number(id) }
    });

    if (!oldFacility) {
      return res.status(404).json({ message: 'Fasilitas tidak ditemukan' });
    }

    const data = {};
    if (nama || nama_kamar) data.nama_kamar = nama || nama_kamar;
    if (deskripsi !== undefined || fasilitas !== undefined) data.fasilitas = deskripsi ?? fasilitas;
    
    if (req.file) {
      data.gambar_url = await uploadFileToSupabase(req.file);
      if (oldFacility.gambar_url) {
        await deleteFileFromSupabase(oldFacility.gambar_url);
      }
    }
    if (harga_mulai !== undefined) data.harga_mulai = parseNumberOrNull(harga_mulai);
    if (jumlah_tersedia !== undefined) data.jumlah_tersedia = parseNumberOrNull(jumlah_tersedia) ?? 0;
    if (status_aktif !== undefined) data.status_aktif = parseBoolean(status_aktif, true);

    console.log('📝 Data yang akan diupdate:', data);

    const facility = await prisma.tipe_kamar.update({ 
      where: { id_kamar: Number(id) }, 
      data 
    });
    
    console.log('✅ Facility berhasil diupdate:', {
      id: facility.id_kamar,
      nama: facility.nama_kamar,
      gambar_url: facility.gambar_url
    });
    console.log('=== UPDATE FACILITY END ===\n');
    
    res.json(normalizeFacility(facility));
  } catch (error) {
    console.error('❌ Error updating facility:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate fasilitas' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingFacility = await prisma.tipe_kamar.findUnique({
      where: { id_kamar: Number(id) }
    });

    if (!existingFacility) {
      return res.status(404).json({ message: 'Fasilitas tidak ditemukan' });
    }

    await prisma.tipe_kamar.delete({ where: { id_kamar: Number(id) } });

    if (existingFacility.gambar_url) {
      await deleteFileFromSupabase(existingFacility.gambar_url);
    }

    res.json({ message: 'Fasilitas berhasil dihapus' });
  } catch (error) {
    console.error('❌ Error deleting facility:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus fasilitas' });
  }
};