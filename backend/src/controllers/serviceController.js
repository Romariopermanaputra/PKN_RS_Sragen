const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const normalizeService = (service) => ({
  id: service.id_layanan,
  nama: service.nama_layanan,
  deskripsi: service.deskripsi_singkat || service.deskripsi_lengkap || '',
  gambar: service.gambar_banner || service.icon_url || null,
  status_aktif: service.status_aktif ?? true,
});

exports.getAll = async (req, res) => {
  try {
    const services = await prisma.layanan.findMany({
      orderBy: { urutan: 'asc' },
    });
    
    console.log('📊 Fetched services:', services.length);
    
    res.json(services.map(normalizeService));
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil layanan' });
  }
};
