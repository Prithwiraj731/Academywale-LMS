const express = require('express');
const cors = require('cors');
const router = express.Router();
const manualEnrollmentController = require('../controllers/manualEnrollment.controller');
const { requireAdminCookie } = require('../middlewares/auth.middleware');

// CORS preflight handlers
router.options('/', cors());
router.options('/api/admin/manual-enrollments', cors());
router.options('/:enrollmentId', cors());
router.options('/api/admin/manual-enrollments/:enrollmentId', cors());
router.options('/:enrollmentId/resend-email', cors());
router.options('/api/admin/manual-enrollments/:enrollmentId/resend-email', cors());

// Relative path routes (when mounted on /api/admin/manual-enrollments)
router.get('/', requireAdminCookie, manualEnrollmentController.listManualEnrollments);
router.get('/:enrollmentId', requireAdminCookie, manualEnrollmentController.getManualEnrollment);
router.post('/', requireAdminCookie, manualEnrollmentController.createManualEnrollment);
router.post('/:enrollmentId/resend-email', requireAdminCookie, manualEnrollmentController.resendEnrollmentEmail);
router.put('/:enrollmentId', requireAdminCookie, manualEnrollmentController.updateManualEnrollment);
router.delete('/:enrollmentId', requireAdminCookie, manualEnrollmentController.deleteManualEnrollment);

// Absolute path routes (when mounted on /)
router.get('/api/admin/manual-enrollments', requireAdminCookie, manualEnrollmentController.listManualEnrollments);
router.get('/api/admin/manual-enrollments/:enrollmentId', requireAdminCookie, manualEnrollmentController.getManualEnrollment);
router.post('/api/admin/manual-enrollments', requireAdminCookie, manualEnrollmentController.createManualEnrollment);
router.post('/api/admin/manual-enrollments/:enrollmentId/resend-email', requireAdminCookie, manualEnrollmentController.resendEnrollmentEmail);
router.put('/api/admin/manual-enrollments/:enrollmentId', requireAdminCookie, manualEnrollmentController.updateManualEnrollment);
router.delete('/api/admin/manual-enrollments/:enrollmentId', requireAdminCookie, manualEnrollmentController.deleteManualEnrollment);

module.exports = router;
