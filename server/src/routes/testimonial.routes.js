const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

router.get('/', testimonialController.getAll);
router.post('/', upload.single('image'), testimonialController.add);
router.put('/:id', upload.single('image'), testimonialController.update);
router.delete('/:id', testimonialController.delete);

module.exports = router; 