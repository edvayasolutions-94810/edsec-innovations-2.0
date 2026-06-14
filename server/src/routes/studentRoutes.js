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
    sendCustomEmail,
    bulkUpdateStudents,
    bulkDeleteStudents
} = require('../controllers/studentController');
const {
    generateAdmissionLetterPDF,
    emailAdmissionLetterPDF,
    generateCertificatePDF,
    emailCertificatePDF
} = require('../controllers/pdfController');
const authMiddleware = require('../utils/authMiddleware');

// Public Route
router.post('/enroll', enrollStudent);
router.post('/login', loginStudent);

// Admin Routes
router.get('/', authMiddleware(['admin']), getStudents);
router.put('/bulk-update', authMiddleware(['admin']), bulkUpdateStudents);
router.delete('/bulk-delete', authMiddleware(['admin']), bulkDeleteStudents);
router.put('/:id', authMiddleware(['admin']), updateStudentDetails);
router.put('/:id/pay', authMiddleware(['admin']), updatePaymentStatus);
router.put('/:id/select', authMiddleware(['admin']), acceptStudent);
router.put('/:id/status', authMiddleware(['admin']), updateStudentStatus);
router.put('/:id/assign-batch', authMiddleware(['admin']), assignStudentBatch);
router.post('/:id/notes', authMiddleware(['admin']), addStudentNote);
router.post('/:id/send-email', authMiddleware(['admin']), sendCustomEmail);
router.get('/:id/admission-letter', authMiddleware(['admin']), generateAdmissionLetterPDF);
router.post('/:id/admission-letter/email', authMiddleware(['admin']), emailAdmissionLetterPDF);
router.get('/:id/certificate', authMiddleware(['admin']), generateCertificatePDF);
router.post('/:id/certificate/email', authMiddleware(['admin']), emailCertificatePDF);
router.delete('/:id', authMiddleware(['admin']), deleteStudent);

module.exports = router;
