const nodemailer = require('nodemailer');

// Setup transporter
const getTransporter = () => {
    const host = process.env.SMTP_HOST || '';
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    // If using Gmail, use nodemailer's built-in gmail service configuration
    if (host.includes('gmail') || user.endsWith('@gmail.com') || process.env.SMTP_SERVICE === 'gmail') {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user || 'edsecinnovations@gmail.com',
                pass: pass
            }
        });
    }

    const port = parseInt(process.env.SMTP_PORT || '587');
    const secure = port === 465;

    return nodemailer.createTransport({
        host: host || 'smtp.ethereal.email',
        port,
        secure,
        auth: {
            user: user || 'dummy_user',
            pass: pass || 'dummy_pass'
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
            subject: `🎉 Congratulations! Your Enrollment Application is Received – EdSec Innovations`,
            text: `Dear ${student.full_name},

Congratulations on taking the first step towards advancing your career with EdSec Innovations!

We have successfully received your enrollment registration for the ${student.course_name} program.

Our admissions team will review your application details and contact you with cohort onboarding instructions shortly.

Thank you for choosing EdSec Innovations.

Best Regards,
Admissions Team
EdSec Innovations`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; line-height: 1.6;">
          <h2 style="color: #0d9488; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">🎉 Congratulations! Enrollment Application Received</h2>
          <p>Dear <strong>${student.full_name}</strong>,</p>
          <p>Congratulations on taking the first step towards advancing your career with <strong>EdSec Innovations</strong>!</p>
          <p>We have successfully received your enrollment registration for the <strong>${student.course_name}</strong> program.</p>
          <p>Our admissions committee will review your application details and contact you with cohort onboarding schedule and orientation instructions shortly.</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px;">
            <p style="margin: 0 0 6px 0; font-weight: bold; color: #0d9488;">Registration Summary:</p>
            <ul style="margin: 0; padding-left: 20px; color: #475569;">
              <li><strong>Selected Program:</strong> ${student.course_name}</li>
              ${student.domain ? `<li><strong>Domain:</strong> ${student.domain}</li>` : ''}
              <li><strong>Applicant Email:</strong> ${student.email}</li>
              <li><strong>Contact Number:</strong> ${student.phone}</li>
            </ul>
          </div>
          
          <p>If you have any immediate questions, feel free to reply directly to this email or chat with our team on WhatsApp at <strong>+91 86601 32700</strong>.</p>
          <br>
          <p style="margin-bottom: 0;">Warm regards,</p>
          <p style="margin-top: 4px; font-weight: bold; color: #0d9488;">Admissions Department<br>EdSec Innovations Pvt. Ltd.</p>
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

const sendContactAdminEmail = async (contact) => {
    try {
        const transporter = getTransporter();
        const adminEmail = process.env.ADMIN_EMAIL || 'edsecinnovations@gmail.com';
        const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const mailOptions = {
            from: `"EDSEC INNOVATIONS" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
            to: adminEmail,
            subject: `New Contact Form Submission – EdSec Innovations`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #14b8a6; border-radius: 12px; background-color: #fafafa; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 10px; margin-top: 0;">New Contact Form Message</h2>
          <p style="color: #475569; font-size: 14px;">You have received a new message via the website contact form. Details below:</p>
          
          <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; border-color: #e2e8f0; font-size: 14px;">
            <tr style="background-color: #f1f5f9; color: #1e293b;">
              <th align="left" style="width: 35%;">Field</th>
              <th align="left">Details</th>
            </tr>
            <tr>
              <td><strong>Name</strong></td>
              <td>${contact.name}</td>
            </tr>
            <tr>
              <td><strong>Email</strong></td>
              <td><a href="mailto:${contact.email}" style="color: #0d9488;">${contact.email}</a></td>
            </tr>
            <tr>
              <td><strong>Phone</strong></td>
              <td><a href="tel:${contact.phone}" style="color: #0d9488;">${contact.phone || 'Not Provided'}</a></td>
            </tr>
            <tr>
              <td><strong>Message</strong></td>
              <td>${contact.message}</td>
            </tr>
          </table>
          <br>
          <p style="font-size: 11px; color: #94a3b8; margin-bottom: 0;">Submitted on: ${dateStr}</p>
        </div>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Contact admin email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending contact admin email:', error);
        throw error;
    }
};

const sendContactUserEmail = async (contact) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: `"EDSEC INNOVATIONS" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
            to: contact.email,
            subject: `Thank you for contacting EdSec Innovations`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; line-height: 1.6;">
          <h2 style="color: #0d9488; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">Message Received</h2>
          <p>Dear <strong>${contact.name}</strong>,</p>
          <p>Thank you for reaching out to EdSec Innovations. We have successfully received your message and our team will get back to you shortly.</p>
          <p>Here is a summary of what you submitted:</p>
          <blockquote style="background-color: #f8fafc; border-left: 4px solid #14b8a6; padding: 15px; margin: 15px 0; font-style: italic; color: #475569;">
            ${contact.message}
          </blockquote>
          <br>
          <p style="margin-bottom: 0;">Regards,</p>
          <p style="margin-top: 4px; font-weight: bold; color: #0d9488;">EdSec Innovations Team</p>
        </div>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Contact user confirmation email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending contact user confirmation email:', error);
        throw error;
    }
};

/**
 * Send an OTP verification email for brochure download.
 */
const sendBrochureOtpEmail = async ({ email, name, otp, programTitle }) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: `"EDSEC INNOVATIONS" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
            to: email,
            subject: `Your Verification Code for Brochure Download – EdSec Innovations`,
            text: `Dear ${name},

Your one-time verification code to download the brochure for ${programTitle} is:

${otp}

This code is valid for 5 minutes. Please do not share this code with anyone.

Best Regards,
EdSec Innovations Team`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 550px; margin: auto; padding: 25px; border: 1px solid #14b8a6; border-radius: 12px; background-color: #ffffff; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #0d9488; margin: 0; font-size: 24px;">EdSec Innovations</h2>
            <p style="color: #64748b; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">Govt. MSME Recognized Training Institute</p>
          </div>
          
          <p style="color: #334155; font-size: 15px;">Hello <strong>${name}</strong>,</p>
          <p style="color: #475569; font-size: 14px;">
            Thank you for your interest in our <strong>${programTitle}</strong> program. Please use the verification code below to complete your verification and download the detailed brochure:
          </p>
          
          <div style="text-align: center; margin: 25px 0;">
            <div style="display: inline-block; background-color: #f0fdfa; border: 2px dashed #0d9488; padding: 12px 30px; border-radius: 10px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #0d9488;">
              ${otp}
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 8px;">Valid for 5 minutes · Single-use code</p>
          </div>
          
          <p style="color: #64748b; font-size: 13px;">
            If you did not request this verification code, you can safely ignore this email.
          </p>
          
          <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #94a3b8; text-align: center;">
            EdSec Innovations Pvt. Ltd. · Bengaluru, India
          </div>
        </div>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Brochure OTP email sent: %s to %s', info.messageId, email);
        return info;
    } catch (error) {
        console.error('Error sending brochure OTP email:', error);
        throw error;
    }
};

/**
 * Send an email notification to Admin when a new free demo class is booked.
 */
const sendDemoBookingAdminEmail = async (booking) => {
    try {
        const transporter = getTransporter();
        const adminEmail = process.env.ADMIN_EMAIL || 'edsecinnovations@gmail.com';
        const dateStr = booking.createdAt 
            ? new Date(booking.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const mailOptions = {
            from: `"EDSEC INNOVATIONS" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
            to: adminEmail,
            subject: `✨ New Demo Class Request – ${booking.name} (${booking.preferredDate})`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #14b8a6; border-radius: 12px; background-color: #fafafa; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 10px; margin-top: 0;">✨ New Demo Class Request</h2>
          <p style="color: #475569; font-size: 14px;">A prospective student has scheduled a free live demo class. Details are below:</p>
          
          <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; border-color: #e2e8f0; font-size: 14px;">
            <tr style="background-color: #f1f5f9; color: #1e293b;">
              <th align="left" style="width: 35%;">Field</th>
              <th align="left">Details</th>
            </tr>
            <tr>
              <td><strong>Student Name</strong></td>
              <td>${booking.name}</td>
            </tr>
            <tr>
              <td><strong>Mobile Number</strong></td>
              <td><a href="tel:${booking.phone}" style="color: #0d9488; font-weight: bold;">${booking.phone}</a></td>
            </tr>
            <tr>
              <td><strong>Email Address</strong></td>
              <td><a href="mailto:${booking.email}" style="color: #0d9488;">${booking.email}</a></td>
            </tr>
            <tr>
              <td><strong>Program Interest</strong></td>
              <td><span style="font-weight: bold; color: #0f766e;">${booking.programInterest || 'General Inquiry'}</span></td>
            </tr>
            <tr>
              <td><strong>Preferred Date</strong></td>
              <td><strong>${booking.preferredDate}</strong></td>
            </tr>
            <tr>
              <td><strong>Preferred Time Slot</strong></td>
              <td><strong>${booking.preferredTime}</strong></td>
            </tr>
            <tr>
              <td><strong>Submitted At</strong></td>
              <td>${dateStr}</td>
            </tr>
          </table>
          
          <div style="margin-top: 25px; text-align: center;">
            <a href="https://wa.me/91${booking.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${booking.name}, thank you for booking a demo class with EdSec Innovations for ${booking.programInterest || 'our programs'}. We are excited to connect with you!`)}" style="display: inline-block; padding: 10px 20px; background-color: #14b8a6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px;">
              Contact on WhatsApp
            </a>
          </div>
          
          <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #64748b; text-align: center;">
            This is an automated demo class alert from the EdSec Innovations Portal.
          </div>
        </div>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Demo booking admin email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending demo booking admin email:', error);
        throw error;
    }
};

/**
 * Send a confirmation email to the Student when their demo class booking is submitted.
 */
const sendDemoBookingStudentEmail = async (booking) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: `"EDSEC INNOVATIONS" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
            to: booking.email,
            subject: `🎉 Free Demo Class Scheduled – EdSec Innovations`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; line-height: 1.6;">
          <h2 style="color: #0d9488; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">🎉 Free Demo Class Booking Confirmed!</h2>
          <p>Dear <strong>${booking.name}</strong>,</p>
          <p>Congratulations on taking the initiative to elevate your tech skills! We are excited to welcome you to a free live demo session with <strong>EdSec Innovations</strong>.</p>
          
          <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #0f766e; font-weight: bold; font-size: 14px;">Your Demo Session Details:</p>
            <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px;">
              <li><strong>Program:</strong> ${booking.programInterest || 'Technology Career Program'}</li>
              <li><strong>Scheduled Date:</strong> ${booking.preferredDate}</li>
              <li><strong>Time Slot:</strong> ${booking.preferredTime}</li>
              <li><strong>Format:</strong> Online Live Interactive Session</li>
            </ul>
          </div>
          
          <p>Our academic mentor will connect with you prior to the session via WhatsApp / Phone call at <strong>${booking.phone}</strong> with the meeting link.</p>
          <p>In this live demo session, you will get:</p>
          <ul>
            <li>Live curriculum walkthrough & hands-on preview</li>
            <li>Direct Q&A with industry experienced mentors</li>
            <li>Placement assistance guidance & career roadmap</li>
          </ul>
          
          <p>If you have any questions or wish to reschedule, feel free to reply to this email or reach us on WhatsApp at <strong>+91 86601 32700</strong>.</p>
          <br>
          <p style="margin-bottom: 0;">Warm regards,</p>
          <p style="margin-top: 4px; font-weight: bold; color: #0d9488;">Admissions & Academic Team<br>EdSec Innovations Pvt. Ltd.</p>
        </div>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Demo booking student confirmation email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending demo booking student email:', error);
        throw error;
    }
};

module.exports = {
    sendEnrollmentEmail,
    sendAdminNotificationEmail,
    sendStudentConfirmationEmail,
    sendApprovalEmail,
    sendRejectionEmail,
    sendOnHoldEmail,
    sendContactAdminEmail,
    sendContactUserEmail,
    sendBrochureOtpEmail,
    sendDemoBookingAdminEmail,
    sendDemoBookingStudentEmail
};
