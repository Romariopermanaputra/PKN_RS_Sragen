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

exports.getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const service = await prisma.layanan.findFirst({
      where: { slug: slug },
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Layanan tidak ditemukan' });
    }
    
    // Also get other services for sidebar
    const others = await prisma.layanan.findMany({
      where: { slug: { not: slug }, status_aktif: true },
      orderBy: { urutan: 'asc' },
    });
    
    res.json({
      ...normalizeService(service),
      deskripsi_lengkap: service.deskripsi_lengkap || '',
      kontak_darurat: service.kontak_darurat || '087878091132',
      others: others.map(normalizeService),
    });
  } catch (error) {
    console.error('❌ Error fetching service by slug:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil layanan' });
  }
};
