require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndFixSlugs() {
  const records = await prisma.layanan.findMany({
    select: { id_layanan: true, nama_layanan: true, slug: true }
  });
  
  console.log('Current records:');
  console.log(JSON.stringify(records, null, 2));
  
  // Update each record that has null slug
  for (const r of records) {
    if (!r.slug) {
      // Generate slug from nama_layanan
      const slug = r.nama_layanan
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      
      await prisma.layanan.update({
        where: { id_layanan: r.id_layanan },
        data: { slug }
      });
      console.log(`✅ Updated [${r.id_layanan}] "${r.nama_layanan}" -> slug: "${slug}"`);
    } else {
      console.log(`⏭️  [${r.id_layanan}] "${r.nama_layanan}" already has slug: "${r.slug}"`);
    }
  }
  
  const updated = await prisma.layanan.findMany({
    select: { id_layanan: true, nama_layanan: true, slug: true }
  });
  console.log('\nFinal state:');
  updated.forEach(r => console.log(`  [${r.id_layanan}] ${r.slug} -> ${r.nama_layanan}`));
  
  await prisma.$disconnect();
}

checkAndFixSlugs().catch(e => { console.error(e); process.exit(1); });
