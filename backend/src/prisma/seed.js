const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.$executeRawUnsafe(
    `INSERT INTO admins (username, password)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password = VALUES(password)`,
    ['admin', hashedPassword]
  );

  await prisma.contact.upsert({
    where: { id: 1 },
    update: {},
    create: {
      telepon: '(0271) 000000',
      email: 'info@rsupkusragen.com',
      alamat: 'Jl. Contoh No. 1, Sragen, Jawa Tengah',
      maps_link: 'https://maps.google.com/?q=Sragen',
    },
  });

  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { linktree_url: 'https://linktr.ee/rsupkusragen' },
  });

  console.log('Seed berhasil');
}

main().catch(console.error).finally(() => prisma.$disconnect());
