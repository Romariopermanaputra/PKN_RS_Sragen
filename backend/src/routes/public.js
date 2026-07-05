const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const doctorController = require('../controllers/doctorController');
const scheduleController = require('../controllers/scheduleController');
const newsController = require('../controllers/newsController');
const facilityController = require('../controllers/facilityController');
const achievementController = require('../controllers/achievementController');
const promotionController = require('../controllers/promotionController');
const contactController = require('../controllers/contactController');
const settingController = require('../controllers/settingController');

router.get('/', (req, res) => {
  res.json({ message: 'Public API' });
});

router.get('/doctors/specialties', doctorController.getSpecialties);
router.get('/doctors/subspecialties', doctorController.getSubspecialties);
router.get('/doctors/:id', doctorController.getById);
router.get('/doctors', doctorController.getAll);
router.get('/schedules', scheduleController.getAll);
router.get('/news', newsController.getAll);
router.get('/news/:id', newsController.getById);
router.get('/facilities', facilityController.getAll);
router.get('/achievements', achievementController.getAll);
router.get('/promotions', promotionController.getAllActive);
router.get('/contact', contactController.get);
router.get('/settings/linktree', settingController.getLinktree);

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Menggunakan Prisma Client karena model admins sudah ada di schema
  const admin = await prisma.admins.findUnique({
    where: { username },
  });

  if (!admin) return res.status(401).json({ message: 'Username atau password salah' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: 'Username atau password salah' });

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

module.exports = router;
