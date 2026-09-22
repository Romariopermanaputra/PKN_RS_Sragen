require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LAYANAN_DATA = [
  {
    nama_layanan: 'Trauma Center (One Day Service)',
    slug: 'trauma-center',
    deskripsi_singkat: 'Pelayanan gawat darurat trauma dengan penanganan cepat dan profesional, termasuk layanan One Day Service untuk pemulihan lebih efisien.',
    deskripsi_lengkap: 'RSU PKU Muhammadiyah Sragen menyediakan Trauma Center dengan tim dokter spesialis bedah dan anestesi yang siap 24 jam. Layanan One Day Service memungkinkan pasien mendapatkan penanganan komprehensif dan pulang di hari yang sama untuk kasus-kasus tertentu, menghemat biaya rawat inap dan mempercepat pemulihan.',
    kontak_darurat: '087878091132',
    urutan: 1,
    status_aktif: true,
  },
  {
    nama_layanan: 'CT Scan',
    slug: 'ct-scan',
    deskripsi_singkat: 'Pemeriksaan CT Scan modern untuk diagnosis yang akurat dan tepat, dengan teknologi terkini untuk hasil gambar yang detail.',
    deskripsi_lengkap: 'RSU PKU Muhammadiyah Sragen dilengkapi dengan peralatan CT Scan (Computed Tomography) generasi terbaru yang menghasilkan gambar penampang tubuh dengan resolusi tinggi. CT Scan membantu dokter dalam mendiagnosis berbagai kondisi seperti tumor, perdarahan, patah tulang, dan gangguan organ internal secara cepat dan akurat.',
    kontak_darurat: '087878091132',
    urutan: 2,
    status_aktif: true,
  },
  {
    nama_layanan: 'Hemodialisa',
    slug: 'hemodialisa',
    deskripsi_singkat: 'Layanan cuci darah (hemodialisa) dengan mesin modern dan tim perawat terlatih untuk pasien gagal ginjal.',
    deskripsi_lengkap: 'Unit Hemodialisa RSU PKU Muhammadiyah Sragen menyediakan layanan cuci darah rutin bagi pasien dengan gangguan ginjal kronis. Dilayani oleh dokter spesialis nefrologi dan perawat terlatih dengan mesin hemodialisis yang modern dan higienis. Tersedia kapasitas tempat duduk yang memadai untuk memenuhi kebutuhan pasien.',
    kontak_darurat: '087878091132',
    urutan: 3,
    status_aktif: true,
  },
  {
    nama_layanan: 'USG 4 Dimensi',
    slug: 'usg-4-dimensi',
    deskripsi_singkat: 'Pemeriksaan USG 4 Dimensi untuk memantau perkembangan janin dengan gambar yang jelas dan detail.',
    deskripsi_lengkap: 'RSU PKU Muhammadiyah Sragen menyediakan layanan USG 4 Dimensi (4D) yang memungkinkan calon orang tua melihat gambaran janin secara real-time dalam tampilan tiga dimensi yang bergerak. Teknologi ini membantu dokter kandungan mendeteksi kelainan struktural janin lebih awal dan memberikan pengalaman yang berharga bagi keluarga.',
    kontak_darurat: '087878091132',
    urutan: 4,
    status_aktif: true,
  },
  {
    nama_layanan: 'Poli Rawat Jalan',
    slug: 'poli-rawat-jalan',
    deskripsi_singkat: 'Poliklinik rawat jalan dengan berbagai spesialisasi dokter yang siap melayani konsultasi dan pengobatan.',
    deskripsi_lengkap: 'Poli Rawat Jalan RSU PKU Muhammadiyah Sragen menyediakan layanan konsultasi dokter spesialis dari berbagai bidang. Dengan sistem pendaftaran online yang mudah, pasien dapat membuat janji temu dengan dokter pilihan mereka dan mendapatkan pelayanan medis yang komprehensif tanpa harus menunggu lama.',
    kontak_darurat: '087878091132',
    urutan: 5,
    status_aktif: true,
  },
  {
    nama_layanan: 'Instalasi Gawat Darurat (IGD)',
    slug: 'igd',
    deskripsi_singkat: 'IGD 24 jam siap melayani kasus-kasus gawat darurat dengan tim medis profesional dan peralatan lengkap.',
    deskripsi_lengkap: 'Instalasi Gawat Darurat (IGD) RSU PKU Muhammadiyah Sragen beroperasi 24 jam sehari, 7 hari seminggu. Dilengkapi dengan peralatan medis terkini dan ditangani oleh dokter jaga berpengalaman serta perawat terlatih yang siap menangani kasus gawat darurat apapun dengan cepat, tepat, dan profesional.',
    kontak_darurat: '087878091132',
    urutan: 6,
    status_aktif: true,
  },
  {
    nama_layanan: 'Laboratorium Klinik',
    slug: 'laboratorium',
    deskripsi_singkat: 'Laboratorium klinik modern dengan berbagai pemeriksaan darah, urin, dan tes diagnostik lainnya.',
    deskripsi_lengkap: 'Laboratorium Klinik RSU PKU Muhammadiyah Sragen menyediakan berbagai pemeriksaan penunjang diagnostik meliputi pemeriksaan darah lengkap, kimia darah, urinalisis, kultur bakteri, dan berbagai tes lainnya. Dilengkapi dengan peralatan otomatis modern yang menghasilkan hasil pemeriksaan akurat dalam waktu singkat.',
    kontak_darurat: '087878091132',
    urutan: 7,
    status_aktif: true,
  },
  {
    nama_layanan: 'Kamar Operasi',
    slug: 'kamar-operasi',
    deskripsi_singkat: 'Kamar operasi modern dengan peralatan canggih untuk berbagai jenis tindakan bedah.',
    deskripsi_lengkap: 'RSU PKU Muhammadiyah Sragen memiliki beberapa kamar operasi (OK) yang dilengkapi dengan peralatan bedah modern dan sistem sterilisasi berstandar tinggi. Ditangani oleh tim dokter bedah spesialis dan anestesiologi berpengalaman, siap melakukan berbagai jenis operasi elektif maupun darurat dengan tingkat keamanan dan keberhasilan yang tinggi.',
    kontak_darurat: '087878091132',
    urutan: 8,
    status_aktif: true,
  },
];

async function insertServices() {
  console.log('🚀 Mulai memasukkan data layanan...');
  
  try {
    // Cek apakah sudah ada data
    const existing = await prisma.layanan.findMany();
    if (existing.length > 0) {
      console.log(`⚠️  Sudah ada ${existing.length} data layanan:`);
      existing.forEach(l => console.log(`  - [${l.id_layanan}] ${l.nama_layanan}`));
      console.log('\nApakah ingin menambahkan data baru? (data yang ada tetap disimpan)');
    }
    
    let created = 0;
    for (const layanan of LAYANAN_DATA) {
      // Cek apakah slug sudah ada
      const exists = await prisma.layanan.findFirst({ where: { slug: layanan.slug } });
      if (exists) {
        console.log(`⏭️  Skip "${layanan.nama_layanan}" (slug sudah ada)`);
        continue;
      }
      
      const result = await prisma.layanan.create({ data: layanan });
      console.log(`✅ Berhasil: [${result.id_layanan}] ${result.nama_layanan}`);
      created++;
    }
    
    console.log(`\n🎉 Selesai! ${created} data layanan berhasil ditambahkan.`);
    
    // Tampilkan semua data
    const all = await prisma.layanan.findMany({ orderBy: { urutan: 'asc' } });
    console.log(`\n📋 Total layanan di database: ${all.length}`);
    all.forEach(l => console.log(`  [${l.id_layanan}] ${l.nama_layanan} (aktif: ${l.status_aktif})`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

insertServices();
