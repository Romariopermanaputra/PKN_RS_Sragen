const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const rawData1 = `
D00004 dr. ANI YULIANTI, Sp.S RABU 16:30:00 19:30:00 POLIKLINIK SARAF SORE 30
D00004 dr. ANI YULIANTI, Sp.S SABTU 09:00:00 11:00:00 POLIKLINIK SARAF SORE 20
D00004 dr. ANI YULIANTI, Sp.S SENIN 08:00:00 11:00:00 POLIKLINIK SARAF PAGI 30
D00004 dr. ANI YULIANTI, Sp.S RABU 07:00:00 11:00:00 POLIKLINIK SARAF PAGI 40
D00004 dr. ANI YULIANTI, Sp.S JUMAT 08:00:00 11:00:00 POLIKLINIK SARAF PAGI 30
D00004 dr. ANI YULIANTI, Sp.S SENIN 16:30:00 19:30:00 POLIKLINIK SARAF SORE 30
D00004 dr. ANI YULIANTI, Sp.S JUMAT 16:30:00 19:30:00 POLIKLINIK SARAF SORE 30
D00004 dr. ANI YULIANTI, Sp.S SELASA 07:00:00 11:00:00 POLIKLINIK SARAF PAGI 40
D00004 dr. ANI YULIANTI, Sp.S KAMIS 08:00:00 11:00:00 POLIKLINIK SARAF PAGI 30
D00005 dr. ANITA WIJAYANTI, Sp.PD, M.Kes SELASA 16:00:00 19:30:00 POLIKLINIK PENYAKIT DALAM 35
D00005 dr. ANITA WIJAYANTI, Sp.PD, M.Kes KAMIS 15:00:00 19:30:00 POLIKLINIK PENYAKIT DALAM 45
D00007 dr. ARIS GUNAWAN, Sp.A, M.Kes SENIN 14:30:00 16:00:00 POLIKLINIK ANAK SORE 15
D00007 dr. ARIS GUNAWAN, Sp.A, M.Kes KAMIS 14:30:00 16:00:00 POLIKLINIK ANAK SORE 15
D00007 dr. ARIS GUNAWAN, Sp.A, M.Kes SELASA 07:00:00 08:30:00 POLIKLINIK ANAK PAGI 15
D00007 dr. ARIS GUNAWAN, Sp.A, M.Kes JUMAT 07:00:00 08:30:00 POLIKLINIK ANAK PAGI 15
D00007 dr. ARIS GUNAWAN, Sp.A, M.Kes SELASA 14:30:00 16:00:00 POLIKLINIK ANAK SORE 15
D00007 dr. ARIS GUNAWAN, Sp.A, M.Kes SENIN 07:00:00 08:30:00 POLIKLINIK ANAK PAGI 15
D00007 dr. ARIS GUNAWAN, Sp.A, M.Kes KAMIS 07:00:00 08:30:00 POLIKLINIK ANAK PAGI 15
D00012 dr. ANDICA YOGA ARTANTO, Sp.B JUMAT 08:00:00 10:00:00 POLIKLINIK BEDAH 20
D00012 dr. ANDICA YOGA ARTANTO, Sp.B KAMIS 12:00:00 14:00:00 POLIKLINIK BEDAH 20
D00012 dr. ANDICA YOGA ARTANTO, Sp.B SABTU 08:00:00 10:00:00 POLIKLINIK BEDAH 20
D00014 dr. IGIN GINTING,Sp.OT KAMIS 10:00:00 11:30:00 POLIKLINIK ORTHOPEDI 15
D00014 dr. IGIN GINTING,Sp.OT SELASA 10:00:00 11:30:00 POLIKLINIK ORTHOPEDI 15
D00015 dr. NARASKY SYARIF RADEN, Sp.OG SELASA 15:30:00 18:00:00 POLIKLINIK KANDUNGAN 25
D00015 dr. NARASKY SYARIF RADEN, Sp.OG KAMIS 15:30:00 18:00:00 POLIKLINIK KANDUNGAN 25
D00015 dr. NARASKY SYARIF RADEN, Sp.OG SENIN 15:30:00 18:00:00 POLIKLINIK KANDUNGAN 25
D00015 dr. NARASKY SYARIF RADEN, Sp.OG RABU 15:30:00 18:00:00 POLIKLINIK KANDUNGAN 25
D00015 dr. NARASKY SYARIF RADEN, Sp.OG JUMAT 15:30:00 18:00:00 POLIKLINIK KANDUNGAN 25
D00016 dr. SUMARJI Sp.N KAMIS 15:00:00 20:00:00 POLIKLINIK SARAF SORE 50
D00016 dr. SUMARJI Sp.N SELASA 15:00:00 20:00:00 POLIKLINIK SARAF SORE 50
D00016 dr. SUMARJI Sp.N SABTU 06:30:00 08:30:00 POLIKLINIK SARAF PAGI 15
D00017 dr. YUSA AMIN NURHUDA, Sp. JP SENIN 07:00:00 07:30:00 POLIKLINIK JANTUNG PAGI 5
D00017 dr. YUSA AMIN NURHUDA, Sp. JP RABU 07:00:00 08:30:00 POLIKLINIK JANTUNG PAGI 15
D00017 dr. YUSA AMIN NURHUDA, Sp. JP JUMAT 07:00:00 08:30:00 POLIKLINIK JANTUNG PAGI 15
D00017 dr. YUSA AMIN NURHUDA, Sp. JP SENIN 14:45:00 17:45:00 POLIKLINIK JANTUNG SORE 30
D00017 dr. YUSA AMIN NURHUDA, Sp. JP RABU 14:45:00 17:45:00 POLIKLINIK JANTUNG SORE 25
D00017 dr. YUSA AMIN NURHUDA, Sp. JP JUMAT 14:45:00 17:45:00 POLIKLINIK JANTUNG SORE 30
D00017 dr. YUSA AMIN NURHUDA, Sp. JP SELASA 07:00:00 08:30:00 POLIKLINIK JANTUNG PAGI 15
D00017 dr. YUSA AMIN NURHUDA, Sp. JP KAMIS 07:00:00 08:30:00 POLIKLINIK JANTUNG PAGI 15
D00017 dr. YUSA AMIN NURHUDA, Sp. JP SABTU 07:00:00 08:30:00 POLIKLINIK JANTUNG PAGI 15
D00017 dr. YUSA AMIN NURHUDA, Sp. JP SELASA 14:45:00 17:45:00 POLIKLINIK JANTUNG SORE 30
D00017 dr. YUSA AMIN NURHUDA, Sp. JP KAMIS 14:45:00 17:45:00 POLIKLINIK JANTUNG SORE 25
D00024 dr. HENDI PRIMA SETYAWAN, Sp.B SENIN 14:30:00 17:00:00 POLIKLINIK BEDAH 25
D00024 dr. HENDI PRIMA SETYAWAN, Sp.B RABU 14:30:00 17:00:00 POLIKLINIK BEDAH 25
D00024 dr. HENDI PRIMA SETYAWAN, Sp.B SELASA 06:00:00 07:30:00 POLIKLINIK BEDAH 15
D00025 drg. SRI SUMARSIH SELASA 09:00:00 11:00:00 POLIKLINIK GIGI & MULUT 30
D00025 drg. SRI SUMARSIH KAMIS 09:00:00 11:00:00 POLIKLINIK GIGI & MULUT 30
D00025 drg. SRI SUMARSIH SABTU 09:00:00 11:00:00 POLIKLINIK GIGI & MULUT 30
D00025 drg. SRI SUMARSIH SENIN 09:00:00 11:00:00 POLIKLINIK GIGI & MULUT 30
D00025 drg. SRI SUMARSIH RABU 09:00:00 11:00:00 POLIKLINIK GIGI & MULUT 30
D00025 drg. SRI SUMARSIH JUMAT 09:00:00 11:00:00 POLIKLINIK GIGI & MULUT 30
D00027 dr. DWI BUDI WAHYONO, Sp.KFR SENIN 18:00:00 21:00:00 POLIKLINIK REHAB MEDIK 30
D00027 dr. DWI BUDI WAHYONO, Sp.KFR RABU 18:00:00 21:00:00 POLIKLINIK REHAB MEDIK 30
D00027 dr. DWI BUDI WAHYONO, Sp.KFR JUMAT 18:00:00 21:00:00 POLIKLINIK REHAB MEDIK 30
D00027 dr. DWI BUDI WAHYONO, Sp.KFR SELASA 18:00:00 21:00:00 POLIKLINIK REHAB MEDIK 30
D00027 dr. DWI BUDI WAHYONO, Sp.KFR KAMIS 18:00:00 21:00:00 POLIKLINIK REHAB MEDIK 30
D00027 dr. DWI BUDI WAHYONO, Sp.KFR SABTU 18:00:00 21:00:00 POLIKLINIK REHAB MEDIK 30
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, SELASA 06:00:00 18:00:00 HEMODIALISA 30
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, SENIN 09:00:00 13:00:00 POLIKLINIK PENYAKIT DALAM 35
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, KAMIS 06:00:00 18:00:00 HEMODIALISA 30
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, RABU 09:00:00 13:00:00 POLIKLINIK PENYAKIT DALAM 40
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, SABTU 06:00:00 18:00:00 HEMODIALISA 30
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, JUMAT 09:00:00 12:00:00 POLIKLINIK PENYAKIT DALAM 30
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, SENIN 06:00:00 18:00:00 HEMODIALISA 30
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, RABU 06:00:00 18:00:00 HEMODIALISA 30
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, SELASA 13:00:00 15:00:00 POLIKLINIK PENYAKIT DALAM 20
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, JUMAT 06:00:00 18:00:00 HEMODIALISA 30
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, KAMIS 09:00:00 13:30:00 POLIKLINIK PENYAKIT DALAM 45
D00030 dr. WIDHY PUJI HARTANTO, Sp.PD, SABTU 09:00:00 13:30:00 POLIKLINIK PENYAKIT DALAM 45
D00032 dr. CYNTIA DAMAYANTI, Sp.P SELASA 12:30:00 15:00:00 POLIKLINIK PARU 25
D00032 dr. CYNTIA DAMAYANTI, Sp.P KAMIS 12:30:00 15:00:00 POLIKLINIK PARU 25
D00032 dr. CYNTIA DAMAYANTI, Sp.P SENIN 12:30:00 15:00:00 POLIKLINIK PARU 25
D00032 dr. CYNTIA DAMAYANTI, Sp.P RABU 12:30:00 15:00:00 POLIKLINIK PARU 25
D00032 dr. CYNTIA DAMAYANTI, Sp.P JUMAT 12:30:00 15:00:00 POLIKLINIK PARU 25
D00033 dr. RAHMAT NUGROHO, Sp. PD SELASA 10:00:00 12:00:00 POLIKLINIK PENYAKIT DALAM 20
D00033 dr. RAHMAT NUGROHO, Sp. PD JUMAT 17:00:00 19:00:00 POLIKLINIK PENYAKIT DALAM 20
D00033 dr. RAHMAT NUGROHO, Sp. PD SENIN 17:00:00 19:00:00 POLIKLINIK PENYAKIT DALAM 20
D00033 dr. RAHMAT NUGROHO, Sp. PD RABU 17:00:00 19:00:00 POLIKLINIK PENYAKIT DALAM 20
D00033 dr. RAHMAT NUGROHO, Sp. PD SABTU 12:30:00 14:00:00 POLIKLINIK PENYAKIT DALAM 15
`;

// Extract data from the first image that is not in the second list
const rawData2 = `
dr. Rahmat Nugroho, Sp.PD., AIFO-K SENIN, RABU, JUM'AT 16:30 19:00 POLIKLINIK PENYAKIT DALAM
dr. Oddie Budi Santosa, Sp. An - - - POLIKLINIK ANESTESI
dr. Andi Ris Firmansyah, Sp. An - - - POLIKLINIK ANESTESI
dr. Yumita Azatin Amalia, Sp.PK - - - POLIKLINIK PATOLOGI KLINIK
dr. Ifada Indriyani, Sp.Rad - - - POLIKLINIK RADIOLOGI
`;

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function getHari(hari) {
  switch (hari.toUpperCase()) {
    case 'SENIN': return 'Senin';
    case 'SELASA': return 'Selasa';
    case 'RABU': return 'Rabu';
    case 'KAMIS': return 'Kamis';
    case 'JUMAT': return 'Jumat';
    case "JUM'AT": return 'Jumat';
    case 'SABTU': return 'Sabtu';
    case 'MINGGU': return 'Minggu';
    default: return null;
  }
}

async function run() {
  try {
    // 1. Delete all existing records
    await prisma.jadwal_praktek.deleteMany({});
    await prisma.dokter.deleteMany({});
    await prisma.spesialis.deleteMany({});
    
    const lines = rawData1.trim().split(/\r?\n/);
    
    const spesialisMap = new Map();
    const dokterMap = new Map();
    
    for (const line of lines) {
      if (!line) continue;
      
      const parts = line.split('\\t');
      // format: D00004 dr. ANI YULIANTI, Sp.S RABU 16:30:00 19:30:00 POLIKLINIK SARAF SORE 30
      // using regex to extract parts since they are space separated
      const match = line.match(/^([A-Z0-9]+)\s+(.+?)\s+(SENIN|SELASA|RABU|KAMIS|JUMAT|SABTU|MINGGU)\s+([0-9:]+)\s+([0-9:]+)\s+(.+?)\s+(\d+)$/i);
      
      if (match) {
        const kode = match[1];
        let nama = match[2];
        const hari = match[3];
        const jam_mulai = match[4];
        const jam_selesai = match[5];
        let poliName = match[6];
        const kuota = match[7];
        
        // Clean up poliName
        if (poliName.includes(' PAGI')) poliName = poliName.replace(' PAGI', '');
        if (poliName.includes(' SORE')) poliName = poliName.replace(' SORE', '');
        if (poliName.includes('POLIKLINIK ')) poliName = poliName.replace('POLIKLINIK ', '');
        
        poliName = poliName.trim();
        
        let sp_name = 'Spesialis ' + poliName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        if (poliName === 'GIGI & MULUT') sp_name = 'Spesialis Gigi & Mulut';
        
        // Ensure spesialis exists
        if (!spesialisMap.has(sp_name)) {
          const sp = await prisma.spesialis.create({
            data: {
              nama_spesialis: sp_name,
              slug: slugify(sp_name)
            }
          });
          spesialisMap.set(sp_name, sp.id_spesialis);
        }
        
        const id_spesialis = spesialisMap.get(sp_name);
        
        // Ensure dokter exists
        if (!dokterMap.has(nama)) {
          const doc = await prisma.dokter.create({
            data: {
              nama_lengkap: nama,
              id_spesialis: id_spesialis,
              status_aktif: true
            }
          });
          dokterMap.set(nama, doc.id_dokter);
        }
        
        const id_dokter = dokterMap.get(nama);
        
        // Add schedule
        await prisma.jadwal_praktek.create({
          data: {
            id_dokter: id_dokter,
            hari: getHari(hari),
            jam_mulai: new Date(`1970-01-01T${jam_mulai}Z`),
            jam_selesai: new Date(`1970-01-01T${jam_selesai}Z`),
            nama_poli: 'Poli ' + poliName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
          }
        });
      }
    }
    
    // Add additional ones from first image (Anestesi, Patologi Klinik, Radiologi, dll)
    const extraDocs = [
      { nama: 'dr. Oddie Budi Santosa, Sp. An', spesialis: 'Spesialis Anestesi' },
      { nama: 'dr. Andi Ris Firmansyah, Sp. An', spesialis: 'Spesialis Anestesi' },
      { nama: 'dr. Yumita Azatin Amalia, Sp.PK', spesialis: 'Spesialis Patologi Klinik' },
      { nama: 'dr. Ifada Indriyani, Sp.Rad', spesialis: 'Spesialis Radiologi' }
    ];
    
    for (const d of extraDocs) {
      if (!spesialisMap.has(d.spesialis)) {
        const sp = await prisma.spesialis.create({
          data: {
            nama_spesialis: d.spesialis,
            slug: slugify(d.spesialis)
          }
        });
        spesialisMap.set(d.spesialis, sp.id_spesialis);
      }
      
      const id_spesialis = spesialisMap.get(d.spesialis);
      
      if (!dokterMap.has(d.nama)) {
        await prisma.dokter.create({
          data: {
            nama_lengkap: d.nama,
            id_spesialis: id_spesialis,
            status_aktif: true
          }
        });
      }
    }
    
    console.log("Successfully seeded doctors and schedules.");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
