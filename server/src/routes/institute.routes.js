const express = require('express');
const router = express.Router();
const multer = require('multer');
const { instituteStorage } = require('../config/cloudinary.config');
const upload = multer({ storage: instituteStorage });
const instituteController = require('../controllers/institute.controller');

// Public routes
router.get('/api/institutes', instituteController.getAllInstitutes);
router.get('/api/institutes/:name', instituteController.getInstituteByName);

// Admin routes
router.post('/api/admin/institutes', upload.single('image'), instituteController.createInstitute);
router.put('/api/admin/institutes/:id', upload.single('image'), instituteController.updateInstitute);
router.delete('/api/admin/institutes/:id', instituteController.deleteInstitute);

module.exports = router;
