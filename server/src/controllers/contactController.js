const { sendContactAdminEmail, sendContactUserEmail } = require('../utils/emailService');
const { sendContactWhatsAppNotification, sendContactUserWhatsAppConfirmation } = require('../utils/whatsappService');

// @route   POST /api/contact
// @desc    Submit a contact form
// @access  Public
const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // 1. Trigger Email Notifications
        try {
            await sendContactAdminEmail({ name, email, phone, message });
        } catch (err) {
            console.error('Contact Admin Email Error:', err.message);
        }

        try {
            await sendContactUserEmail({ name, email, phone, message });
        } catch (err) {
            console.error('Contact User Email Error:', err.message);
        }

        // 2. Trigger WhatsApp Notifications
        try {
            await sendContactWhatsAppNotification({ name, email, phone, message });
        } catch (err) {
            console.error('Contact Admin WhatsApp Error:', err.message);
        }

        try {
            await sendContactUserWhatsAppConfirmation({ name, email, phone, message });
        } catch (err) {
            console.error('Contact User WhatsApp Error:', err.message);
        }

        res.status(200).json({ message: 'Thank you for contacting us. We will get back to you soon.' });
    } catch (err) {
        console.error('Contact form submission error:', err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    submitContactForm
};
