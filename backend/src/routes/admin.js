const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const doctorController = require('../controllers/doctorController');
const scheduleController = require('../controllers/scheduleController');
const newsController = require('../controllers/newsController');
const facilityController = require('../controllers/facilityController');
const achievementController = require('../controllers/achievementController');
const promotionController = require('../controllers/promotionController');
const contactController = require('../controllers/contactController');
const settingController = require('../controllers/settingController');
const dashboardController = require('../controllers/dashboardController');

router.use(authMiddleware);

// ✅ Multer Error Handler Middleware
const handleUploadError = (err, req, res, next) => {
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Ukuran file terlalu besar. Maksimal 5MB.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Error upload: ${err.message}`,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

router.get('/', (req, res) => {
  res.json({ message: 'Admin API' });
});

// =====================
// DASHBOARD
// =====================
router.get('/dashboard/stats', dashboardController.getStats);
router.get('/dashboard/activities', dashboardController.getActivities);

// =====================
// DOCTORS
// =====================
router.get('/doctors', doctorController.getAll);
router.post('/doctors', upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'pelatihan_files', maxCount: 10 }]), handleUploadError, doctorController.create);
router.put('/doctors/:id', upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'pelatihan_files', maxCount: 10 }]), handleUploadError, doctorController.update);
router.delete('/doctors/:id', doctorController.remove);

// =====================
// SCHEDULES
// =====================
router.get('/schedules', scheduleController.getAll);
router.post('/schedules', scheduleController.create);
router.put('/schedules/:id', scheduleController.update);
router.delete('/schedules/:id', scheduleController.remove);

// =====================
// NEWS
// =====================
router.get('/news', newsController.getAll);
router.post('/news', upload.single('gambar'), handleUploadError, newsController.create);
router.put('/news/:id', upload.single('gambar'), handleUploadError, newsController.update);
router.delete('/news/:id', newsController.remove);

// =====================
// FACILITIES
// =====================
router.get('/facilities', facilityController.getAll);
router.post('/facilities', upload.single('gambar'), handleUploadError, facilityController.create);
router.put('/facilities/:id', upload.single('gambar'), handleUploadError, facilityController.update);
router.delete('/facilities/:id', facilityController.remove);

// =====================
// ACHIEVEMENTS
// =====================
router.get('/achievements', achievementController.getAll);
router.post('/achievements', upload.single('gambar'), handleUploadError, achievementController.create);
router.put('/achievements/:id', upload.single('gambar'), handleUploadError, achievementController.update);
router.delete('/achievements/:id', achievementController.remove);

// =====================
// PROMOTIONS
// =====================
router.get('/promotions', promotionController.getAllAdmin);
router.post('/promotions', upload.single('gambar'), handleUploadError, promotionController.create);
router.put('/promotions/:id', upload.single('gambar'), handleUploadError, promotionController.update);
router.delete('/promotions/:id', promotionController.remove);

// =====================
// CONTACT & SETTINGS
// =====================
router.put('/contact', contactController.update);
router.put('/settings/linktree', settingController.updateLinktree);

module.exports = router;