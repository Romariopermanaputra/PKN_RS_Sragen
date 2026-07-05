const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const docs = await prisma.dokter.findMany();
  console.log("Docs:", docs.length);
  console.log(docs.map(d => d.nama_lengkap));
  
  const scheds = await prisma.jadwal_praktek.findMany();
  console.log("Scheds:", scheds.length);
}
run();
