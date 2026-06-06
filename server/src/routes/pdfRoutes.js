const express = require('express');
const router = express.Router();
const { downloadSyllabusPDF } = require('../controllers/pdfController');

// Public route but guarded internally by the downloaded_enabled Boolean
router.get('/:id/syllabus-pdf', downloadSyllabusPDF);

module.exports = router;
