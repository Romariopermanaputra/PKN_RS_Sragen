require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Menambahkan 3 Berita
  const news1 = await prisma.news.create({
    data: {
      judul: 'Berita Terkini RSUD Sragen',
      isi: 'Ini adalah isi berita terkini yang ditambahkan secara otomatis.',
      gambar: '1783250476218-585688013.png'
    }
  });
  
  const news2 = await prisma.news.create({
    data: {
      judul: 'Fasilitas Baru Telah Hadir',
      isi: 'Rumah Sakit Sragen kini dilengkapi dengan fasilitas kesehatan terbaru.',
      gambar: '1783250766842-544205062.png'
    }
  });

  const news3 = await prisma.news.create({
    data: {
      judul: 'Penyuluhan Kesehatan Masyarakat',
      isi: 'Ikuti penyuluhan kesehatan gratis di RSUD Sragen minggu ini.',
      gambar: '1783250977453-344156656.png'
    }
  });

  // Menambahkan 2 Promo
  const promo1 = await prisma.promotion.create({
    data: {
      judul: 'Promo Paket Medical Check-Up',
      deskripsi: 'Dapatkan diskon 20% untuk paket MCU lengkap bulan ini.',
      gambar: '1783251196905-183425425.png',
      tanggal_mulai: new Date(),
      tanggal_berakhir: new Date(new Date().setMonth(new Date().getMonth() + 1)) // 1 bulan dari sekarang
    }
  });

  const promo2 = await prisma.promotion.create({
    data: {
      judul: 'Vaksinasi Flu Diskon Spesial',
      deskripsi: 'Lindungi keluarga Anda dari flu dengan vaksin harga khusus.',
      gambar: '1783251531714-905979224.png',
      tanggal_mulai: new Date(),
      tanggal_berakhir: new Date(new Date().setMonth(new Date().getMonth() + 1))
    }
  });

  console.log('✅ Berhasil memasukkan data berita dan promo ke database Supabase!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
