const express = require('express');
const cors = require('cors');
const router = express.Router();
const manualEnrollmentController = require('../controllers/manualEnrollment.controller');
const { requireAdminCookie } = require('../middlewares/auth.middleware');

// CORS preflight handlers
router.options('/api/admin/manual-enrollments', cors());
router.options('/api/admin/manual-enrollments/:enrollmentId', cors());

router.get('/api/admin/manual-enrollments', requireAdminCookie, manualEnrollmentController.listManualEnrollments);
router.get('/api/admin/manual-enrollments/:enrollmentId', requireAdminCookie, manualEnrollmentController.getManualEnrollment);
router.post('/api/admin/manual-enrollments', requireAdminCookie, manualEnrollmentController.createManualEnrollment);
router.put('/api/admin/manual-enrollments/:enrollmentId', requireAdminCookie, manualEnrollmentController.updateManualEnrollment);
router.delete('/api/admin/manual-enrollments/:enrollmentId', requireAdminCookie, manualEnrollmentController.deleteManualEnrollment);

module.exports = router;
