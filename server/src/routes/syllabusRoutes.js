const express = require('express');
const router = express.Router();
const { createSyllabus, updateSyllabus, deleteSyllabus } = require('../controllers/syllabusController');
const authMiddleware = require('../utils/authMiddleware');

// Protected routes (Admin only)
router.post('/', authMiddleware(['admin']), createSyllabus);
router.put('/:id', authMiddleware(['admin']), updateSyllabus);
router.delete('/:id', authMiddleware(['admin']), deleteSyllabus);

module.exports = router;
