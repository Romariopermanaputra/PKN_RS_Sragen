const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config({ path: path.join(__dirname, '.env') });

const prisma = new PrismaClient();

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--username' || item === '-u') {
      args.username = argv[i + 1];
    } else if (item === '--password' || item === '-p') {
      args.password = argv[i + 1];
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const username = args.username || process.env.ADMIN_USERNAME || 'admin';
  const password = args.password || process.env.ADMIN_PASSWORD || 'admin123';

  const hashedPassword = await bcrypt.hash(password, 10);

  // Upsert: create if not exists, update if exists
  await prisma.admins.upsert({
    where: { username },
    update: {
      password: hashedPassword,
      created_at: new Date(),
    },
    create: {
      username,
      password: hashedPassword,
    },
  });

  console.log(`Admin account created successfully.`);
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log('You can now login from the admin page.');

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error('Failed to create admin account.');
  console.error(error.message);
  await prisma.$disconnect();
  process.exit(1);
});
