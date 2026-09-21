const express = require('express');
const router = express.Router();
const {
    requestOtp,
    verifyOtp,
    downloadBrochure,
    getBrochureLeads,
    deleteBrochureLead
} = require('../controllers/brochureController');
const authMiddleware = require('../utils/authMiddleware');

// Public Brochure OTP & Download Routes
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.get('/download', downloadBrochure);

// Admin Brochure Lead Management Routes
router.get('/leads', authMiddleware(['admin']), getBrochureLeads);
router.delete('/leads/:id', authMiddleware(['admin']), deleteBrochureLead);

module.exports = router;
