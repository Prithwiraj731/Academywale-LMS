const express = require('express');
const router = express.Router();
const manualEnrollmentController = require('../controllers/manualEnrollment.controller');
const { requireAdminCookie } = require('../middlewares/auth.middleware');

router.get('/api/admin/manual-enrollments', requireAdminCookie, manualEnrollmentController.listManualEnrollments);
router.get('/api/admin/manual-enrollments/:enrollmentId', requireAdminCookie, manualEnrollmentController.getManualEnrollment);
router.post('/api/admin/manual-enrollments', requireAdminCookie, manualEnrollmentController.createManualEnrollment);
router.put('/api/admin/manual-enrollments/:enrollmentId', requireAdminCookie, manualEnrollmentController.updateManualEnrollment);
router.delete('/api/admin/manual-enrollments/:enrollmentId', requireAdminCookie, manualEnrollmentController.deleteManualEnrollment);

module.exports = router;
