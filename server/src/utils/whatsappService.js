const axios = require('axios');

/**
 * Send an automated WhatsApp notification to the admin when a new enrollment is received.
 * Supports Twilio and Meta WhatsApp API configurations.
 */
const sendWhatsAppNotification = async (student) => {
    const adminPhone = process.env.ADMIN_WHATSAPP || '918660132700';
    const dateStr = student.enrollment_date 
        ? new Date(student.enrollment_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Format message matching user's exact specification
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

    // 1. Check for Twilio WhatsApp configuration
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
            const sid = process.env.TWILIO_ACCOUNT_SID;
            const token = process.env.TWILIO_AUTH_TOKEN;
            const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // default Twilio sandbox
            
            // Format number to Twilio spec: e.g. "whatsapp:+918660132700"
            const to = adminPhone.startsWith('whatsapp:') ? adminPhone : `whatsapp:+${adminPhone.replace('+', '')}`;
            
            const authHeader = 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64');
            const data = new URLSearchParams({
                To: to,
                From: from,
                Body: messageBody
            });

            await axios.post(
                `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
                data.toString(),
                {
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            console.log('WhatsApp notification sent successfully via Twilio.');
            return;
        } catch (error) {
            console.error('WhatsApp Error (Twilio):', error.response?.data || error.message);
            throw new Error(`Twilio WhatsApp failed: ${error.message}`);
        }
    }

    // 2. Check for Meta WhatsApp Cloud API configuration
    if (process.env.META_WA_ACCESS_TOKEN && process.env.META_WA_PHONE_NUMBER_ID) {
        try {
            const token = process.env.META_WA_ACCESS_TOKEN;
            const phoneId = process.env.META_WA_PHONE_NUMBER_ID;
            
            // Clean number to pure digits
            const to = adminPhone.replace(/[^0-9]/g, '');

            await axios.post(
                `https://graph.facebook.com/v19.0/${phoneId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'text',
                    text: {
                        body: messageBody
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('WhatsApp notification sent successfully via Meta Cloud API.');
            return;
        } catch (error) {
            console.error('WhatsApp Error (Meta Cloud):', error.response?.data || error.message);
            throw new Error(`Meta WhatsApp failed: ${error.message}`);
        }
    }

    console.warn('WhatsApp credentials not configured. Skipping WhatsApp notification.');
};

const sendStudentWhatsAppStatus = async (student, status) => {
    const studentPhone = student.whatsapp_number || student.phone;
    if (!studentPhone) {
        console.warn('No student phone number available. Skipping student WhatsApp.');
        return;
    }

    let messageBody = '';
    if (status === 'Approved') {
        messageBody = `🎉 Congratulations ${student.full_name}!

Your application for the ${student.course_name} program has been approved.

Our team will contact you shortly with onboarding instructions and batch details.

Regards,
EdSec Innovations`;
    } else if (status === 'Rejected') {
        messageBody = `Hello ${student.full_name},

Thank you for applying to EdSec Innovations.

Your application has not been approved for the current batch.

We encourage you to apply for future opportunities.

Regards,
EdSec Innovations`;
    } else if (status === 'On Hold') {
        messageBody = `Hello ${student.full_name},

Your application is currently under review.

We will update you shortly regarding the next steps.

Regards,
EdSec Innovations`;
    } else {
        return; // Skip other statuses
    }

    // 1. Check for Twilio WhatsApp configuration
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
            const sid = process.env.TWILIO_ACCOUNT_SID;
            const token = process.env.TWILIO_AUTH_TOKEN;
            const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
            const to = studentPhone.startsWith('whatsapp:') ? studentPhone : `whatsapp:+${studentPhone.replace(/[^0-9]/g, '')}`;
            
            const authHeader = 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64');
            const data = new URLSearchParams({ To: to, From: from, Body: messageBody });

            await axios.post(
                `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
                data.toString(),
                {
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            console.log(`Student status WhatsApp sent via Twilio to ${to}`);
            return;
        } catch (error) {
            console.error('WhatsApp Error (Twilio):', error.response?.data || error.message);
            throw error;
        }
    }

    // 2. Check for Meta WhatsApp Cloud API configuration
    if (process.env.META_WA_ACCESS_TOKEN && process.env.META_WA_PHONE_NUMBER_ID) {
        try {
            const token = process.env.META_WA_ACCESS_TOKEN;
            const phoneId = process.env.META_WA_PHONE_NUMBER_ID;
            const to = studentPhone.replace(/[^0-9]/g, '');

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
            console.log(`Student status WhatsApp sent via Meta to ${to}`);
            return;
        } catch (error) {
            console.error('WhatsApp Error (Meta Cloud):', error.response?.data || error.message);
            throw error;
        }
    }

    console.warn('WhatsApp credentials not configured. Skipping student WhatsApp status notification.');
};

/**
 * Send an automated WhatsApp notification to the admin when a new contact form is received.
 */
const sendContactWhatsAppNotification = async (contact) => {
    const adminPhone = process.env.ADMIN_WHATSAPP || '918660132700';
    const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const messageBody = `📞 New Contact Message Received – EdSec Innovations
 
👤 Name: ${contact.name}
📧 Email: ${contact.email}
📱 Phone: ${contact.phone || 'Not Provided'}
💬 Message: ${contact.message}
 
⏰ Submitted On:
${dateStr}`;

    // 1. Check for Twilio WhatsApp configuration
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
            const sid = process.env.TWILIO_ACCOUNT_SID;
            const token = process.env.TWILIO_AUTH_TOKEN;
            const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
            const to = adminPhone.startsWith('whatsapp:') ? adminPhone : `whatsapp:+${adminPhone.replace('+', '')}`;
            
            const authHeader = 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64');
            const data = new URLSearchParams({ To: to, From: from, Body: messageBody });

            await axios.post(
                `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
                data.toString(),
                {
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            console.log('Contact WhatsApp notification sent successfully via Twilio.');
            return;
        } catch (error) {
            console.error('WhatsApp Error (Twilio Contact):', error.response?.data || error.message);
            throw new Error(`Twilio WhatsApp failed: ${error.message}`);
        }
    }

    // 2. Check for Meta WhatsApp Cloud API configuration
    if (process.env.META_WA_ACCESS_TOKEN && process.env.META_WA_PHONE_NUMBER_ID) {
        try {
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
            console.log('Contact WhatsApp notification sent successfully via Meta Cloud API.');
            return;
        } catch (error) {
            console.error('WhatsApp Error (Meta Cloud Contact):', error.response?.data || error.message);
            throw new Error(`Meta WhatsApp failed: ${error.message}`);
        }
    }

    console.warn('WhatsApp credentials not configured. Skipping contact WhatsApp notification.');
};

/**
 * Send a confirmation WhatsApp message to the user who submitted the contact form.
 */
const sendContactUserWhatsAppConfirmation = async (contact) => {
    const userPhone = contact.phone;
    if (!userPhone) {
        console.warn('No user phone number available. Skipping contact user WhatsApp confirmation.');
        return;
    }

    const messageBody = `Hello ${contact.name},
 
Thank you for contacting EdSec Innovations. We have successfully received your message and our team will get back to you shortly.
 
Regards,
EdSec Innovations`;

    // 1. Check for Twilio WhatsApp configuration
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
            const sid = process.env.TWILIO_ACCOUNT_SID;
            const token = process.env.TWILIO_AUTH_TOKEN;
            const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
            const to = userPhone.startsWith('whatsapp:') ? userPhone : `whatsapp:+${userPhone.replace(/[^0-9]/g, '')}`;
            
            const authHeader = 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64');
            const data = new URLSearchParams({ To: to, From: from, Body: messageBody });

            await axios.post(
                `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
                data.toString(),
                {
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            console.log(`Contact confirmation WhatsApp sent via Twilio to ${to}`);
            return;
        } catch (error) {
            console.error('WhatsApp Error (Twilio Contact User):', error.response?.data || error.message);
        }
    }

    // 2. Check for Meta WhatsApp Cloud API configuration
    if (process.env.META_WA_ACCESS_TOKEN && process.env.META_WA_PHONE_NUMBER_ID) {
        try {
            const token = process.env.META_WA_ACCESS_TOKEN;
            const phoneId = process.env.META_WA_PHONE_NUMBER_ID;
            const to = userPhone.replace(/[^0-9]/g, '');

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
            console.log(`Contact confirmation WhatsApp sent via Meta to ${to}`);
            return;
        } catch (error) {
            console.error('WhatsApp Error (Meta Cloud Contact User):', error.response?.data || error.message);
        }
    }
};

/**
 * Send a confirmation WhatsApp message to the student who just registered/enrolled.
 */
const sendStudentEnrollmentWhatsAppConfirmation = async (student) => {
    const studentPhone = student.phone;
    if (!studentPhone) {
        console.warn('No student phone number available. Skipping student enrollment WhatsApp confirmation.');
        return;
    }

    const messageBody = `Hello ${student.full_name},
 
Thank you for enrolling in the ${student.course_name} program at EdSec Innovations. We have successfully received your application. Our team will contact you shortly with further details.
 
Regards,
EdSec Innovations`;

    // 1. Check for Twilio WhatsApp configuration
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
            const sid = process.env.TWILIO_ACCOUNT_SID;
            const token = process.env.TWILIO_AUTH_TOKEN;
            const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
            const to = studentPhone.startsWith('whatsapp:') ? studentPhone : `whatsapp:+${studentPhone.replace(/[^0-9]/g, '')}`;
            
            const authHeader = 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64');
            const data = new URLSearchParams({ To: to, From: from, Body: messageBody });

            await axios.post(
                `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
                data.toString(),
                {
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            console.log(`Enrollment confirmation WhatsApp sent via Twilio to ${to}`);
            return;
        } catch (error) {
            console.error('WhatsApp Error (Twilio Enroll User):', error.response?.data || error.message);
        }
    }

    // 2. Check for Meta WhatsApp Cloud API configuration
    if (process.env.META_WA_ACCESS_TOKEN && process.env.META_WA_PHONE_NUMBER_ID) {
        try {
            const token = process.env.META_WA_ACCESS_TOKEN;
            const phoneId = process.env.META_WA_PHONE_NUMBER_ID;
            const to = studentPhone.replace(/[^0-9]/g, '');

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
            console.log(`Enrollment confirmation WhatsApp sent via Meta to ${to}`);
            return;
        } catch (error) {
            console.error('WhatsApp Error (Meta Cloud Enroll User):', error.response?.data || error.message);
        }
    }
};

module.exports = {
    sendWhatsAppNotification,
    sendStudentWhatsAppStatus,
    sendContactWhatsAppNotification,
    sendContactUserWhatsAppConfirmation,
    sendStudentEnrollmentWhatsAppConfirmation
};
