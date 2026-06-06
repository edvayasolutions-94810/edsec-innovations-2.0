const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Define Mongoose Schema directly inside the function to make it fully self-contained on Netlify Lambda
const StudentSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    college_name: { type: String, required: false },
    degree: { type: String, required: false },
    branch: { type: String, required: false },
    year_of_study: { type: String, required: false },
    course_name: { type: String, required: true },
    course_duration: { type: String, required: false },
    domain: { type: String, required: false },
    price_paid: { type: String, required: false },
    qualification: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    message: { type: String, required: false },
    enrollment_date: { type: Date, default: Date.now },
    payment_status: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    status: { type: String, enum: ['Not Selected', 'Selected'], default: 'Not Selected' }
}, { timestamps: true });

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) return cachedDb;
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        throw new Error('Database URI (MONGODB_URI or MONGO_URI) is not defined in environment variables');
    }
    const db = await mongoose.connect(uri);
    cachedDb = db;
    return db;
};

// Setup Nodemailer Transporter
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

// Send Admin Notification Email
const sendAdminNotificationEmail = async (student) => {
    const transporter = getTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || 'edsecinnovations@gmail.com';
    const dateStr = student.enrollment_date 
        ? new Date(student.enrollment_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const mailOptions = {
        from: '"EDSEC INNOVATIONS" <noreply@edsecinnovations.com>',
        to: adminEmail,
        subject: `New Student Enrollment – EdSec Innovations`,
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #14b8a6; border-radius: 12px; background-color: #fafafa;">
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
    </div>`
    };

    await transporter.sendMail(mailOptions);
};

// Send Student Receipt Email
const sendStudentConfirmationEmail = async (student) => {
    const transporter = getTransporter();
    const mailOptions = {
        from: '"EDSEC INNOVATIONS" <noreply@edsecinnovations.com>',
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
    </div>`
    };

    await transporter.sendMail(mailOptions);
};

// Send Twilio / Meta WhatsApp Alert
const sendWhatsAppNotification = async (student) => {
    const adminPhone = process.env.ADMIN_WHATSAPP || '918660132700';
    const dateStr = student.enrollment_date 
        ? new Date(student.enrollment_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const messageBody = `🚀 New Enrollment Received – EdSec Innovations

👤 Name: ${student.full_name}
📧 Email: ${student.email}
📱 Phone: ${student.phone}
🏫 College: ${student.college_name || 'Not Provided'}
🎓 Degree: ${student.degree || 'Not Provided'}
📚 Branch: ${student.branch || 'Not Provided'}
📅 Year: ${student.year_of_study || 'Not Provided'}
💻 Program: ${student.course_name}
🚀 Domain: ${student.domain || 'Not Provided'}
📍 Location: ${student.city || 'N/A'}, ${student.state || 'N/A'}

⏰ Submitted On:
${dateStr}`;

    // Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
        const to = adminPhone.startsWith('whatsapp:') ? adminPhone : `whatsapp:+${adminPhone.replace('+', '')}`;
        const authHeader = 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64');
        
        await axios.post(
            `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
            new URLSearchParams({ To: to, From: from, Body: messageBody }).toString(),
            {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return;
    }

    // Meta WhatsApp Cloud API
    if (process.env.META_WA_ACCESS_TOKEN && process.env.META_WA_PHONE_NUMBER_ID) {
        const token = process.env.META_WA_ACCESS_TOKEN;
        const phoneId = process.env.META_WA_PHONE_NUMBER_ID;
        const to = adminPhone.replace(/[^0-9]/g, '');

        await axios.post(
            `https://graph.facebook.com/v19.0/${phoneId}/messages`,
            {
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: messageBody }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return;
    }
};

const triggerNotifications = async (student) => {
    try { await sendAdminNotificationEmail(student); } catch (e) { console.error('Admin Email Error:', e.message); }
    try { await sendStudentConfirmationEmail(student); } catch (e) { console.error('Student Email Error:', e.message); }
    try { await sendWhatsAppNotification(student); } catch (e) { console.error('WhatsApp Error:', e.message); }
};

// Exports Netlify Lambda handler
exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        const body = JSON.parse(event.body);
        const { 
            full_name, email, phone, course_name, course_duration, domainSelected, 
            price_paid, qualification, college_name, degree, branch, year_of_study, 
            city, state, message 
        } = body;

        // Validation checks
        if (!full_name || !email || !phone || !course_name || !domainSelected || !college_name || !degree || !branch || !year_of_study || !city || !state) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Missing required enrollment parameters' })
            };
        }

        await connectToDatabase();

        let student = await Student.findOne({ email });
        if (student) {
            if (student.payment_status === 'Unpaid' && student.status === 'Not Selected') {
                student.full_name = full_name;
                student.phone = phone;
                student.course_name = course_name;
                student.course_duration = course_duration;
                student.domain = domainSelected;
                student.price_paid = price_paid;
                student.qualification = qualification;
                student.college_name = college_name;
                student.degree = degree;
                student.branch = branch;
                student.year_of_study = year_of_study;
                student.city = city;
                student.state = state;
                student.message = message;

                await student.save();
                await triggerNotifications(student);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ message: '✅ Enrollment submitted successfully. Our team has received your application and will contact you shortly.' })
                };
            }
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Student already exists' })
            };
        }

        student = new Student({
            full_name,
            email,
            phone,
            course_name,
            course_duration,
            domain: domainSelected,
            price_paid,
            qualification,
            college_name,
            degree,
            branch,
            year_of_study,
            city,
            state,
            message
        });

        await student.save();
        await triggerNotifications(student);

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ message: '✅ Enrollment submitted successfully. Our team has received your application and will contact you shortly.' })
        };
    } catch (error) {
        console.error('Serverless enrollment exception:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'An internal error occurred', error: error.message })
        };
    }
};
