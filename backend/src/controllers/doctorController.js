const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const formatTime = (value) => {
  if (!value) return '-';
  if (value instanceof Date) return value.toTimeString().slice(0, 5);
  if (typeof value === 'string') {
    return value.includes(':') ? value.slice(0, 5) : value;
  }
  return String(value);
};

const normalizeDoctor = (doctor) => ({
  id: doctor.id_dokter ?? doctor.id,
  id_dokter: doctor.id_dokter ?? doctor.id,
  nama: doctor.nama_lengkap ?? doctor.nama ?? doctor.name ?? 'Dokter',
  nama_lengkap: doctor.nama_lengkap ?? doctor.nama ?? doctor.name ?? 'Dokter',
  id_spesialis: doctor.id_spesialis ?? null,
  id_subspesialis: doctor.id_subspesialis ?? null,
  spesialis: doctor.spesialis?.nama_spesialis ?? doctor.spesialis ?? doctor.spesialis_name ?? '',
  subspesialis: doctor.subspesialis?.nama_subspesialis ?? '',
  foto: doctor.foto_url ?? doctor.foto ?? null,
  foto_url: doctor.foto_url ?? doctor.foto ?? null,
  deskripsi: doctor.deskripsi ?? doctor.description ?? null,
  status_aktif: doctor.status_aktif ?? true,
  schedules: Array.isArray(doctor.jadwal_praktek)
    ? doctor.jadwal_praktek.map((schedule) => ({
        id: schedule.id_jadwal ?? schedule.id,
        hari: schedule.hari ?? schedule.day ?? '',
        jam_mulai: formatTime(schedule.jam_mulai),
        jam_selesai: formatTime(schedule.jam_selesai),
        nama_poli: schedule.nama_poli ?? schedule.poliklinik ?? '',
      }))
    : [],
});

const slugify = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'yes', 'on', 'aktif'].includes(String(value).toLowerCase());
};

// ✅ UPDATE: Helper baru yang bisa menerima input berupa ID (angka) atau Nama (string)
const getSpecialtyId = async (input) => {
  if (!input) return undefined;
  const trimmed = String(input).trim();
  
  // Jika input adalah angka (ID), langsung kembalikan sebagai number
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }
  
  // Jika input adalah string (nama), cari atau buat
  const existing = await prisma.spesialis.findFirst({
    where: { nama_spesialis: trimmed },
  });
  if (existing) return existing.id_spesialis;

  const created = await prisma.spesialis.create({
    data: { nama_spesialis: trimmed, slug: slugify(trimmed) || null },
  });
  return created.id_spesialis;
};

const getSubspecialtyId = async (input) => {
  if (!input) return null;
  const trimmed = String(input).trim();
  
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }
  
  const existing = await prisma.subspesialis.findFirst({
    where: { nama_subspesialis: trimmed },
  });
  if (existing) return existing.id_subspesialis;

  const created = await prisma.subspesialis.create({
    data: { nama_subspesialis: trimmed, slug: slugify(trimmed) || null },
  });
  return created.id_subspesialis;
};

exports.getAll = async (req, res) => {
  try {
    const doctors = await prisma.dokter.findMany({
      include: {
        spesialis: { select: { nama_spesialis: true } },
        subspesialis: { select: { nama_subspesialis: true } },
        jadwal_praktek: true,
      },
      orderBy: { id_dokter: 'desc' },
    });
    res.json(doctors.map(normalizeDoctor));
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengambil data dokter',
      error: error.message // <-- Error detail akan muncul di Network tab browser
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama, nama_lengkap, spesialis, subspesialis, deskripsi, status_aktif } = req.body;
    const foto = req.file ? req.file.filename : null;

    const specialtyId = await getSpecialtyId(spesialis);
    const subspecialtyId = await getSubspecialtyId(subspesialis);

    const doctor = await prisma.dokter.create({
      data: {
        nama_lengkap: nama || nama_lengkap,
        deskripsi,
        foto_url: foto,
        id_spesialis: specialtyId,
        id_subspesialis: subspecialtyId,
        status_aktif: parseBoolean(status_aktif, true),
      },
      include: {
        spesialis: { select: { nama_spesialis: true } },
        subspesialis: { select: { nama_subspesialis: true } },
        jadwal_praktek: true,
      },
    });
    res.status(201).json(normalizeDoctor(doctor));
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menambah dokter',
      error: error.message, // <-- Lihat pesan error asli di sini!
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, nama_lengkap, spesialis, subspesialis, deskripsi, status_aktif } = req.body;
    const foto = req.file ? req.file.filename : undefined;

    const data = {};
    
    if (nama || nama_lengkap) data.nama_lengkap = nama || nama_lengkap;
    if (deskripsi !== undefined) data.deskripsi = deskripsi;
    if (foto) data.foto_url = foto;
    
    if (spesialis !== undefined) {
      data.id_spesialis = await getSpecialtyId(spesialis);
    }
    if (subspesialis !== undefined) {
      data.id_subspesialis = await getSubspecialtyId(subspesialis);
    }
    
    if (status_aktif !== undefined) data.status_aktif = parseBoolean(status_aktif, true);

    const doctor = await prisma.dokter.update({
      where: { id_dokter: Number(id) },
      data,
      include: {
        spesialis: { select: { nama_spesialis: true } },
        subspesialis: { select: { nama_subspesialis: true } },
        jadwal_praktek: true,
      },
    });
    res.json(normalizeDoctor(doctor));
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengupdate dokter',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await prisma.dokter.findUnique({
      where: { id_dokter: Number(id) },
      include: {
        spesialis: { select: { nama_spesialis: true } },
        subspesialis: { select: { nama_subspesialis: true } },
        jadwal_praktek: true,
      },
    });
    if (!doctor) {
      return res.status(404).json({ message: 'Dokter tidak ditemukan' });
    }
    res.json(normalizeDoctor(doctor));
  } catch (error) {
    console.error('Error fetching doctor detail:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengambil detail dokter',
      error: error.message 
    });
  }
};

// ✅ UPDATE: Mengembalikan objek lengkap (ID dan Nama) agar frontend lebih fleksibel
exports.getSpecialties = async (req, res) => {
  try {
    const specialties = await prisma.spesialis.findMany({
      orderBy: { nama_spesialis: 'asc' },
    });
    res.json(specialties);
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data spesialisasi', error: error.message });
  }
};

exports.getSubspecialties = async (req, res) => {
  try {
    const subspecialties = await prisma.subspesialis.findMany({
      orderBy: { nama_subspesialis: 'asc' },
    });
    res.json(subspecialties);
  } catch (error) {
    console.error('Error fetching subspecialties:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data subspesialisasi', error: error.message });
  }
};

// ✅ UPDATE: Hapus jadwal_praktek terlebih dahulu untuk menghindari error Foreign Key
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Hapus semua jadwal praktek milik dokter ini terlebih dahulu
    await prisma.jadwal_praktek.deleteMany({
      where: { id_dokter: Number(id) }
    });

    await prisma.dokter.delete({ where: { id_dokter: Number(id) } });
    res.json({ message: 'Dokter berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menghapus dokter',
      error: error.message 
    });
  }
};