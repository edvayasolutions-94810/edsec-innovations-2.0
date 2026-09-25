const express = require('express');
const router = express.Router();
const {
    submitDemoBooking,
    getDemoBookings,
    updateDemoBookingStatus,
    deleteDemoBooking
} = require('../controllers/demoBookingController');
const authMiddleware = require('../utils/authMiddleware');

// Public route: book a free demo
router.post('/', submitDemoBooking);

// Protected routes: admin only
router.get('/', authMiddleware(['admin']), getDemoBookings);
router.patch('/:id', authMiddleware(['admin']), updateDemoBookingStatus);
router.delete('/:id', authMiddleware(['admin']), deleteDemoBooking);

module.exports = router;
