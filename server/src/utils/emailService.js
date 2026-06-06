const nodemailer = require('nodemailer');

// Setup transporter
const getTransporter = () => {
    const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
    const port = parseInt(process.env.SMTP_PORT || '587');
    const secure = port === 465;

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user: process.env.SMTP_USER || 'dummy_user',
            pass: process.env.SMTP_PASS || 'dummy_pass'
        }
    });
};

/**
 * Send an email notification to the Admin with a professional details table.
 */
const sendAdminNotificationEmail = async (student) => {
    try {
        const transporter = getTransporter();
        const adminEmail = process.env.ADMIN_EMAIL || 'edsecinnovations@gmail.com';
        const dateStr = student.enrollment_date 
            ? new Date(student.enrollment_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const mailOptions = {
            from: `"EDSEC INNOVATIONS" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
            to: adminEmail,
            subject: `New Student Enrollment – EdSec Innovations`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #14b8a6; border-radius: 12px; background-color: #fafafa; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 10px; margin-top: 0;">New Enrollment Received</h2>
          <p style="color: #475569; font-size: 14px;">A new student has successfully submitted an enrollment form. Below are the details:</p>
          
          <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; border-color: #e2e8f0; font-size: 14px;">
            <tr style="background-color: #f1f5f9; color: #1e293b;">
              <th align="left" style="width: 35%;">Field</th>
              <th align="left">Details</th>
            </tr>
            <tr>
              <td><strong>Full Name</strong></td>
              <td>${student.full_name}</td>
            </tr>
            <tr>
              <td><strong>Email Address</strong></td>
              <td><a href="mailto:${student.email}" style="color: #0d9488;">${student.email}</a></td>
            </tr>
            <tr>
              <td><strong>Mobile Number</strong></td>
              <td><a href="tel:${student.phone}" style="color: #0d9488;">${student.phone}</a></td>
            </tr>
            <tr>
              <td><strong>College Name</strong></td>
              <td>${student.college_name || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Degree</strong></td>
              <td>${student.degree || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Branch / Specialization</strong></td>
              <td>${student.branch || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Year of Study</strong></td>
              <td>${student.year_of_study || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Selected Program</strong></td>
              <td>${student.course_name}</td>
            </tr>
            <tr>
              <td><strong>Preferred Domain</strong></td>
              <td>${student.domain || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>City</strong></td>
              <td>${student.city || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>State</strong></td>
              <td>${student.state || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Highest Qualification</strong></td>
              <td>${student.qualification || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Additional Notes</strong></td>
              <td>${student.message || 'None'}</td>
            </tr>
            <tr>
              <td><strong>Submission Date & Time</strong></td>
              <td>${dateStr}</td>
            </tr>
          </table>
          
          <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #64748b; text-align: center;">
            This is an automated notification from the EdSec Innovations Portal.
          </div>
        </div>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Admin notification email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending admin email:', error);
        throw error;
    }
};

/**
 * Send a confirmation email to the student.
 */
const sendStudentConfirmationEmail = async (student) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: `"EDSEC INNOVATIONS" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
            to: student.email,
            subject: `Enrollment Received – EdSec Innovations`,
            text: `Dear ${student.full_name},

Thank you for enrolling with EdSec Innovations.

We have successfully received your enrollment request and our team will review your application shortly.

Our representatives will contact you regarding the next steps.

Thank you for choosing EdSec Innovations.

Best Regards,
EdSec Innovations Team`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; line-height: 1.6;">
          <h2 style="color: #0d9488; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">Enrollment Received</h2>
          <p>Dear <strong>${student.full_name}</strong>,</p>
          <p>Thank you for enrolling with <strong>EdSec Innovations</strong>.</p>
          <p>We have successfully received your enrollment request and our team will review your application shortly.</p>
          <p>Our representatives will contact you regarding the next steps.</p>
          <p>Thank you for choosing EdSec Innovations.</p>
          <br>
          <p style="margin-bottom: 0;">Best Regards,</p>
          <p style="margin-top: 4px; font-weight: bold; color: #0d9488;">EdSec Innovations Team</p>
        </div>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Student confirmation email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending student email:', error);
        throw error;
    }
};

const sendEnrollmentEmail = async (toEmail, studentName, track, phone = '', domain = '', qualification = '', message = '') => {
    // Legacy proxy support for backward compatibility
    const student = {
        full_name: studentName,
        email: toEmail,
        phone,
        course_name: track,
        domain,
        qualification,
        message,
        enrollment_date: new Date()
    };
    try {
        await sendAdminNotificationEmail(student);
        await sendStudentConfirmationEmail(student);
    } catch (err) {
        console.error('Legacy sendEnrollmentEmail proxy failed:', err.message);
    }
};

const sendApprovalEmail = async (student) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: `"EDSEC INNOVATIONS" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
            to: student.email,
            subject: `🎉 Congratulations! Your Enrollment Has Been Approved`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; line-height: 1.6;">
          <h2 style="color: #0d9488; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">🎉 Congratulations! Application Approved</h2>
          <p>Dear <strong>${student.full_name}</strong>,</p>
          <p>Congratulations!</p>
          <p>We are pleased to inform you that your application for the <strong>${student.course_name}</strong> program at EdSec Innovations has been approved.</p>
          <p>Your seat has been reserved for the upcoming batch.</p>
          <p>You will soon receive:</p>
          <ul>
            <li>Batch Details</li>
            <li>Orientation Schedule</li>
            <li>Program Resources</li>
            <li>Important Dates</li>
          </ul>
          <p>We look forward to helping you grow your career.</p>
          <br>
          <p style="margin-bottom: 0;">Regards,</p>
          <p style="margin-top: 4px; font-weight: bold; color: #0d9488;">EdSec Innovations Team</p>
        </div>
      `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Approval email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw error;
    }
};

const sendRejectionEmail = async (student) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: `"EDSEC INNOVATIONS" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
            to: student.email,
            subject: `Application Status Update – EdSec Innovations`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; line-height: 1.6;">
          <h2 style="color: #ef4444; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">Application Status Update</h2>
          <p>Dear <strong>${student.full_name}</strong>,</p>
          <p>Thank you for your interest in EdSec Innovations.</p>
          <p>After reviewing your application, we regret to inform you that your application has not been approved for the current batch.</p>
          <p>This decision may be based on eligibility requirements, available seats, or program-specific criteria.</p>
          <p>We encourage you to apply for future programs and opportunities.</p>
          <br>
          <p style="margin-bottom: 0;">Regards,</p>
          <p style="margin-top: 4px; font-weight: bold; color: #ef4444;">EdSec Innovations Team</p>
        </div>
      `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Rejection email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending rejection email:', error);
        throw error;
    }
};

const sendOnHoldEmail = async (student) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: `"EDSEC INNOVATIONS" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
            to: student.email,
            subject: `Application Under Review – EdSec Innovations`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; line-height: 1.6;">
          <h2 style="color: #f59e0b; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">Application Under Review</h2>
          <p>Dear <strong>${student.full_name}</strong>,</p>
          <p>Your application is currently under review.</p>
          <p>Our admissions team may require additional verification before making a final decision.</p>
          <p>We will update you soon regarding the next steps.</p>
          <br>
          <p style="margin-bottom: 0;">Regards,</p>
          <p style="margin-top: 4px; font-weight: bold; color: #f59e0b;">EdSec Innovations Team</p>
        </div>
      `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('On hold email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending on hold email:', error);
        throw error;
    }
};

module.exports = {
    sendEnrollmentEmail,
    sendAdminNotificationEmail,
    sendStudentConfirmationEmail,
    sendApprovalEmail,
    sendRejectionEmail,
    sendOnHoldEmail
};
