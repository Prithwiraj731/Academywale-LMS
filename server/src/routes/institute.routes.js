const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const instituteController = require('../controllers/institute.controller');
const { requireAdminCookie } = require('../middlewares/auth.middleware');

// Public routes
router.get('/api/institutes', instituteController.getAllInstitutes);
router.get('/api/institutes/:name', instituteController.getInstituteByName);

// Admin routes
router.post('/api/admin/institutes', requireAdminCookie, upload.single('image'), instituteController.createInstitute);
router.put('/api/admin/institutes/:id', requireAdminCookie, upload.single('image'), instituteController.updateInstitute);
router.delete('/api/admin/institutes/:id', requireAdminCookie, instituteController.deleteInstitute);

module.exports = router;
