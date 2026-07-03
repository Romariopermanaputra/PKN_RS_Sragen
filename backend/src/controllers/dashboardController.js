const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/admin/dashboard/stats
 * Mengembalikan total count semua entitas
 */
exports.getStats = async (req, res) => {
  try {
    const [doctors, news, facilities, promotions, achievements, schedules] = await Promise.all([
      prisma.dokter.count(),
      prisma.news.count(),
      prisma.tipe_kamar.count(),
      prisma.promotion.count(),
      prisma.achievement.count(),
      prisma.jadwal_praktek.count(),
    ]);

    res.json({
      doctors,
      news,
      facilities,
      promotions,
      achievements,
      schedules,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik' });
  }
};

/**
 * GET /api/admin/dashboard/activities
 * Mengembalikan aktivitas terbaru dari semua tabel (gabungan, diurutkan by waktu desc)
 */
exports.getActivities = async (req, res) => {
  try {
    const TAKE = 15;

    const [doctors, news, promotions, achievements] = await Promise.all([
      // Dokter terbaru – tidak ada timestamp, pakai id_dokter desc sebagai proxy
      prisma.dokter.findMany({
        take: TAKE,
        orderBy: { id_dokter: 'desc' },
        select: { id_dokter: true, nama_lengkap: true },
      }),

      // Berita terbaru
      prisma.news.findMany({
        take: TAKE,
        orderBy: { updated_at: 'desc' },
        select: { id: true, judul: true, created_at: true, updated_at: true },
      }),

      // Promosi terbaru
      prisma.promotion.findMany({
        take: TAKE,
        orderBy: { updated_at: 'desc' },
        select: { id: true, judul: true, created_at: true, updated_at: true },
      }),

      // Prestasi terbaru
      prisma.achievement.findMany({
        take: TAKE,
        orderBy: { updated_at: 'desc' },
        select: { id: true, judul: true, created_at: true, updated_at: true },
      }),
    ]);

    const activities = [];

    // Dokter – tidak ada kolom timestamp, gunakan id_proxy
    doctors.forEach((d) => {
      activities.push({
        type: 'dokter',
        icon: 'user-plus',
        color: '#346739',
        text: `Dokter "${d.nama_lengkap}" ditambahkan`,
        created_at: null,
        id_proxy: d.id_dokter,
      });
    });

    // Helper untuk mendeteksi apakah record baru (created) atau diupdate
    const isNewRecord = (created_at, updated_at) => {
      if (!created_at || !updated_at) return true;
      return Math.abs(new Date(updated_at) - new Date(created_at)) < 10000; // selisih < 10 detik = baru dibuat
    };

    // Berita
    news.forEach((n) => {
      const isNew = isNewRecord(n.created_at, n.updated_at);
      activities.push({
        type: 'berita',
        icon: isNew ? 'file-plus' : 'file-pencil',
        color: '#79AE6F',
        text: isNew
          ? `Berita "${n.judul}" diterbitkan`
          : `Berita "${n.judul}" diperbarui`,
        created_at: n.updated_at || n.created_at,
        id_proxy: n.id,
      });
    });

    // Promosi
    promotions.forEach((p) => {
      const isNew = isNewRecord(p.created_at, p.updated_at);
      activities.push({
        type: 'promosi',
        icon: isNew ? 'discount-2' : 'pencil',
        color: '#346739',
        text: isNew
          ? `Promosi "${p.judul}" ditambahkan`
          : `Promosi "${p.judul}" diperbarui`,
        created_at: p.updated_at || p.created_at,
        id_proxy: p.id,
      });
    });

    // Prestasi
    achievements.forEach((a) => {
      const isNew = isNewRecord(a.created_at, a.updated_at);
      activities.push({
        type: 'prestasi',
        icon: isNew ? 'award' : 'trophy',
        color: '#79AE6F',
        text: isNew
          ? `Prestasi "${a.judul}" ditambahkan`
          : `Prestasi "${a.judul}" diperbarui`,
        created_at: a.updated_at || a.created_at,
        id_proxy: a.id,
      });
    });

    // Urutkan: yang punya created_at tampil lebih dulu (terbaru), tanpa timestamp di akhir (by id desc)
    activities.sort((a, b) => {
      if (a.created_at && b.created_at) {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (a.created_at) return -1;
      if (b.created_at) return 1;
      return b.id_proxy - a.id_proxy;
    });

    res.json(activities.slice(0, 10));
  } catch (error) {
    console.error('Error fetching dashboard activities:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil aktivitas' });
  }
};
