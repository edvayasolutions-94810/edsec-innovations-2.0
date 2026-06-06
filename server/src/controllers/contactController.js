const { sendEnrollmentEmail } = require('../utils/emailService');
// We can reuse the email service for generic contact or create a new one. Let's just create a simple console log for now or send an email to admin

// @route   POST /api/contact
// @desc    Submit a contact form
// @access  Public
const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Ideally save to DB or send email to admin
        console.log(`Contact Form Submission from ${name} (${email}, ${phone}): ${message}`);

        res.status(200).json({ message: 'Thank you for contacting us. We will get back to you soon.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    submitContactForm
};
