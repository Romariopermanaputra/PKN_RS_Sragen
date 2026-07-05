require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  console.log('--- NEWS ---');
  console.log(await prisma.news.findMany());
  console.log('--- PROMOTIONS ---');
  console.log(await prisma.promotion.findMany());
}
main().catch(console.error).finally(() => prisma.$disconnect());
