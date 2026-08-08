const express = require('express');
const cors = require('cors');
const router = express.Router();
const manualEnrollmentController = require('../controllers/manualEnrollment.controller');
const { requireAdminCookie } = require('../middlewares/auth.middleware');

// CORS preflight handlers
router.options('/', cors());
router.options('/:enrollmentId', cors());

router.get('/', requireAdminCookie, manualEnrollmentController.listManualEnrollments);
router.get('/:enrollmentId', requireAdminCookie, manualEnrollmentController.getManualEnrollment);
router.post('/', requireAdminCookie, manualEnrollmentController.createManualEnrollment);
router.put('/:enrollmentId', requireAdminCookie, manualEnrollmentController.updateManualEnrollment);
router.delete('/:enrollmentId', requireAdminCookie, manualEnrollmentController.deleteManualEnrollment);

module.exports = router;
