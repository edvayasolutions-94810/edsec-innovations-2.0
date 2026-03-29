const express = require('express');
const router = express.Router();
const { enrollStudent, getStudents, updatePaymentStatus, deleteStudent, acceptStudent, loginStudent } = require('../controllers/studentController');
const authMiddleware = require('../utils/authMiddleware');

// Public Route
router.post('/enroll', enrollStudent);
router.post('/login', loginStudent);

// Admin Routes
router.get('/', authMiddleware(['admin']), getStudents);
router.put('/:id/pay', authMiddleware(['admin']), updatePaymentStatus);
router.put('/:id/select', authMiddleware(['admin']), acceptStudent);
router.delete('/:id', authMiddleware(['admin']), deleteStudent);

module.exports = router;
