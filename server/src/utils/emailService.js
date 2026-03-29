const nodemailer = require('nodemailer');

// Helper to send emails for enrollment
const sendEnrollmentEmail = async (toEmail, studentName, track) => {
    try {
        // Note: For production, we should configure actual SMTP details in .env
        // This is using a dummy ethereal email if not configured
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_USER || 'dummy_user',
                pass: process.env.SMTP_PASS || 'dummy_pass'
            }
        });

        const mailOptions = {
            from: '"EDSEC INNOVATIONS" <noreply@edsecinnovations.com>',
            to: toEmail,
            subject: 'Welcome to EDSEC INNOVATIONS Internship Training!',
            html: `
        <h2>Welcome, ${studentName}!</h2>
        <p>You have successfully enrolled in the <strong>${track}</strong> track.</p>
        <p>Our team will contact you shortly regarding the next steps and payment confirmation.</p>
        <br>
        <p>Best Regards,</p>
        <p>EDSEC INNOVATIONS Team</p>
      `
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = {
    sendEnrollmentEmail
};
