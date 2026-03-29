const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, toggleSyllabusDownload } = require('../controllers/courseController');
const authMiddleware = require('../utils/authMiddleware');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes (Admin only)
router.post('/', authMiddleware(['admin']), createCourse);
router.put('/:id', authMiddleware(['admin']), updateCourse);
router.delete('/:id', authMiddleware(['admin']), deleteCourse);
router.patch('/:id/toggle-syllabus', authMiddleware(['admin']), toggleSyllabusDownload);

module.exports = router;
