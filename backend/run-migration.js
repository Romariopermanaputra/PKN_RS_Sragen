require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Jalankan migrasi SQL langsung melalui Prisma $executeRaw
async function migrate() {
  try {
    console.log('Adding pendidikan, pengalaman, pelatihan columns to dokter...');
    
    await prisma.$executeRawUnsafe(`ALTER TABLE "dokter" ADD COLUMN IF NOT EXISTS "pendidikan" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "dokter" ADD COLUMN IF NOT EXISTS "pengalaman" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "dokter" ADD COLUMN IF NOT EXISTS "pelatihan" TEXT`);
    
    console.log('✅ Migration successful! Columns added.');
    
    // Verify
    const sample = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'dokter' ORDER BY ordinal_position`;
    console.log('Columns in dokter table:');
    sample.forEach(c => console.log(' -', c.column_name));
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
