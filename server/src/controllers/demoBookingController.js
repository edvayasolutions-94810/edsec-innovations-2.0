const DemoBooking = require('../models/DemoBooking');
const { 
    sendDemoBookingWhatsAppNotification, 
    sendDemoBookingUserWhatsAppConfirmation 
} = require('../utils/whatsappService');

// @route   POST /api/demo-bookings
// @desc    Submit a new free demo class booking request
// @access  Public
const submitDemoBooking = async (req, res) => {
    try {
        const { name, phone, email, preferredDate, preferredTime, programInterest } = req.body;

        if (!name || !phone || !email || !preferredDate || !preferredTime) {
            return res.status(400).json({ 
                message: 'Please provide all required fields: name, phone, email, preferred date, and preferred time.' 
            });
        }

        const booking = new DemoBooking({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            preferredDate: String(preferredDate).trim(),
            preferredTime: String(preferredTime).trim(),
            programInterest: programInterest ? String(programInterest).trim() : 'Not specified',
            status: 'New'
        });

        await booking.save();

        // 1. Send Admin WhatsApp Notification (non-blocking)
        try {
            await sendDemoBookingWhatsAppNotification(booking);
        } catch (waErr) {
            console.error('Demo Booking Admin WhatsApp Error:', waErr.message);
        }

        // 2. Send Student WhatsApp Confirmation (non-blocking)
        try {
            await sendDemoBookingUserWhatsAppConfirmation(booking);
        } catch (waErr) {
            console.error('Demo Booking User WhatsApp Error:', waErr.message);
        }

        res.status(201).json({
            success: true,
            message: "Thanks! We'll confirm your demo slot shortly.",
            booking
        });
    } catch (err) {
        console.error('Error submitting demo booking:', err);
        res.status(500).json({ message: 'Server error while scheduling demo class.' });
    }
};

// @route   GET /api/demo-bookings
// @desc    Get all demo bookings (newest first)
// @access  Protected (Admin only)
const getDemoBookings = async (req, res) => {
    try {
        const bookings = await DemoBooking.find().sort({ createdAt: -1 });
        res.json({ success: true, count: bookings.length, bookings });
    } catch (err) {
        console.error('Error retrieving demo bookings:', err);
        res.status(500).json({ message: 'Failed to retrieve demo class bookings.' });
    }
};

// @route   PATCH /api/demo-bookings/:id
// @desc    Update demo booking status
// @access  Protected (Admin only)
const updateDemoBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['New', 'Contacted', 'Scheduled', 'Completed'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
            });
        }

        const booking = await DemoBooking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Demo booking not found.' });
        }

        res.json({ success: true, message: 'Status updated successfully.', booking });
    } catch (err) {
        console.error('Error updating demo booking status:', err);
        res.status(500).json({ message: 'Failed to update demo booking status.' });
    }
};

// @route   DELETE /api/demo-bookings/:id
// @desc    Delete a demo booking
// @access  Protected (Admin only)
const deleteDemoBooking = async (req, res) => {
    try {
        const booking = await DemoBooking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Demo booking not found.' });
        }
        res.json({ success: true, message: 'Demo booking deleted successfully.' });
    } catch (err) {
        console.error('Error deleting demo booking:', err);
        res.status(500).json({ message: 'Failed to delete demo booking.' });
    }
};

module.exports = {
    submitDemoBooking,
    getDemoBookings,
    updateDemoBookingStatus,
    deleteDemoBooking
};
