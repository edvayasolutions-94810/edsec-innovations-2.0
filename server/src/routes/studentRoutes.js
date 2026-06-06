const express = require('express');
const router = express.Router();
const { 
    enrollStudent, 
    getStudents, 
    updatePaymentStatus, 
    deleteStudent, 
    acceptStudent, 
    loginStudent,
    updateStudentDetails,
    updateStudentStatus,
    addStudentNote,
    assignStudentBatch,
    sendCustomEmail
} = require('../controllers/studentController');
const {
    generateAdmissionLetterPDF,
    emailAdmissionLetterPDF
} = require('../controllers/pdfController');
const authMiddleware = require('../utils/authMiddleware');

// Public Route
router.post('/enroll', enrollStudent);
router.post('/login', loginStudent);

// Admin Routes
router.get('/', authMiddleware(['admin']), getStudents);
router.put('/:id', authMiddleware(['admin']), updateStudentDetails);
router.put('/:id/pay', authMiddleware(['admin']), updatePaymentStatus);
router.put('/:id/select', authMiddleware(['admin']), acceptStudent);
router.put('/:id/status', authMiddleware(['admin']), updateStudentStatus);
router.put('/:id/assign-batch', authMiddleware(['admin']), assignStudentBatch);
router.post('/:id/notes', authMiddleware(['admin']), addStudentNote);
router.post('/:id/send-email', authMiddleware(['admin']), sendCustomEmail);
router.get('/:id/admission-letter', authMiddleware(['admin']), generateAdmissionLetterPDF);
router.post('/:id/admission-letter/email', authMiddleware(['admin']), emailAdmissionLetterPDF);
router.delete('/:id', authMiddleware(['admin']), deleteStudent);

module.exports = router;
