const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const Batch = require('../models/Batch');
const { 
    sendAdminNotificationEmail, 
    sendStudentConfirmationEmail,
    sendApprovalEmail,
    sendRejectionEmail,
    sendOnHoldEmail 
} = require('../utils/emailService');
const { 
    sendWhatsAppNotification,
    sendStudentWhatsAppStatus 
} = require('../utils/whatsappService');

// Helper function to trigger notifications asynchronously and catch individual errors so they do not block execution
const triggerNotifications = async (student) => {
    // 1. Send Admin Email
    try {
        await sendAdminNotificationEmail(student);
    } catch (err) {
        console.error('Email Error: Failed to send Admin Notification Email:', err.message);
    }

    // 2. Send Student Confirmation Email
    try {
        await sendStudentConfirmationEmail(student);
    } catch (err) {
        console.error('Email Error: Failed to send Student Confirmation Email:', err.message);
    }

    // 3. Send WhatsApp Notification
    try {
        await sendWhatsAppNotification(student);
    } catch (err) {
        console.error('WhatsApp Error: Failed to send Admin WhatsApp Notification:', err.message);
    }
};

// @route   POST /api/students/enroll
// @desc    Enroll a new student
// @access  Public
const enrollStudent = async (req, res) => {
    try {
        const { 
            full_name, email, phone, course_name, course_duration, domainSelected, 
            price_paid, qualification, college_name, degree, branch, year_of_study, 
            city, state, message 
        } = req.body;

        let student = await Student.findOne({ email });
        if (student) {
            // Allow updating the pending request if they are unpaid and not selected
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
                
                // Trigger notifications
                triggerNotifications(student);
                
                return res.status(200).json({ message: '✅ Enrollment submitted successfully. Our team has received your application and will contact you shortly.' });
            }
            return res.status(400).json({ message: 'Student already exists' });
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

        // Trigger notifications
        triggerNotifications(student);

        res.status(201).json({ message: '✅ Enrollment submitted successfully. Our team has received your application and will contact you shortly.' });
    } catch (err) {
        console.error('SERVER ERROR DURING ENROLL:', err.message);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};

// @route   GET /api/admin/students
// @desc    Get all enrolled students
// @access  Private (Admin)
const getStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-password_hash');
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/admin/students/:id/payment
// @desc    Update student payment status
// @access  Private (Admin)
const updatePaymentStatus = async (req, res) => {
    try {
        const { payment_status } = req.body;

        let student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: { payment_status } },
            { new: true }
        ).select('-password_hash');

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/admin/students/:id
// @desc    Delete a student
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/admin/students/:id/select
// @desc    Accept student enrollment (Select)
// @access  Private (Admin)
const acceptStudent = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: { status: 'Selected' } },
            { new: true }
        ).select('-password_hash');

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/students/login
// @desc    Login student via email
// @access  Public
const loginStudent = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const student = await Student.findOne({ email }).select('-password_hash');
        if (!student) {
            return res.status(404).json({ message: 'No enrollment found with this email' });
        }

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateStudentDetails = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const allowedFields = [
            'full_name', 'email', 'phone', 'whatsapp_number', 'dob', 'gender',
            'course_name', 'course_duration', 'domain', 'program_fee', 'amount_paid',
            'qualification', 'college_name', 'university', 'degree', 'branch',
            'semester', 'year_of_study', 'graduation_year', 'city', 'state', 'message'
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                student[field] = req.body[field];
            }
        });

        await student.save();
        
        const updatedStudent = await Student.findById(req.params.id).select('-password_hash');
        res.json(updatedStudent);
    } catch (err) {
        console.error('Update details error:', err.message);
        res.status(500).send('Server Error');
    }
};

const updateStudentStatus = async (req, res) => {
    try {
        const { status, adminName } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const oldStatus = student.status;
        student.status = status;
        
        if (!student.status_history) student.status_history = [];
        student.status_history.push({ status, updatedBy: adminName || 'Admin' });

        if (status !== oldStatus) {
            const author = adminName || 'Admin';
            if (status === 'Approved') {
                try {
                    await sendApprovalEmail(student);
                    student.email_status = 'Sent';
                    student.communication_history.push({
                        type: 'email',
                        subject: '🎉 Congratulations! Your Enrollment Has Been Approved',
                        message: 'Approval email sent successfully.',
                        status: 'Sent',
                        sender: author
                    });
                } catch (err) {
                    student.email_status = 'Error';
                    console.error(err);
                }

                try {
                    await sendStudentWhatsAppStatus(student, 'Approved');
                    student.whatsapp_status = 'Sent';
                    student.communication_history.push({
                        type: 'whatsapp',
                        subject: 'WhatsApp Status Alert',
                        message: 'Approval WhatsApp message sent successfully.',
                        status: 'Sent',
                        sender: author
                    });
                } catch (err) {
                    student.whatsapp_status = 'Error';
                    console.error(err);
                }
            } else if (status === 'Rejected') {
                try {
                    await sendRejectionEmail(student);
                    student.email_status = 'Sent';
                    student.communication_history.push({
                        type: 'email',
                        subject: 'Application Status Update – EdSec Innovations',
                        message: 'Rejection email sent successfully.',
                        status: 'Sent',
                        sender: author
                    });
                } catch (err) {
                    student.email_status = 'Error';
                    console.error(err);
                }

                try {
                    await sendStudentWhatsAppStatus(student, 'Rejected');
                    student.whatsapp_status = 'Sent';
                    student.communication_history.push({
                        type: 'whatsapp',
                        subject: 'WhatsApp Status Alert',
                        message: 'Rejection WhatsApp message sent successfully.',
                        status: 'Sent',
                        sender: author
                    });
                } catch (err) {
                    student.whatsapp_status = 'Error';
                    console.error(err);
                }
            } else if (status === 'On Hold') {
                try {
                    await sendOnHoldEmail(student);
                    student.email_status = 'Sent';
                    student.communication_history.push({
                        type: 'email',
                        subject: 'Application Under Review – EdSec Innovations',
                        message: 'On hold email sent successfully.',
                        status: 'Sent',
                        sender: author
                    });
                } catch (err) {
                    student.email_status = 'Error';
                    console.error(err);
                }

                try {
                    await sendStudentWhatsAppStatus(student, 'On Hold');
                    student.whatsapp_status = 'Sent';
                    student.communication_history.push({
                        type: 'whatsapp',
                        subject: 'WhatsApp Status Alert',
                        message: 'On hold WhatsApp message sent successfully.',
                        status: 'Sent',
                        sender: author
                    });
                } catch (err) {
                    student.whatsapp_status = 'Error';
                    console.error(err);
                }
            }
        }

        await student.save();
        res.json(student);
    } catch (err) {
        console.error('Update status error:', err.message);
        res.status(500).send('Server Error');
    }
};

const addStudentNote = async (req, res) => {
    try {
        const { content, author } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!student.admin_notes) student.admin_notes = [];
        student.admin_notes.push({
            content,
            author: author || 'Admin',
            timestamp: new Date()
        });

        await student.save();
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const assignStudentBatch = async (req, res) => {
    try {
        const { batchId } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const oldBatchId = student.batch_id;
        
        if (batchId) {
            const batch = await Batch.findById(batchId);
            if (!batch) {
                return res.status(404).json({ message: 'Batch not found' });
            }
            student.batch_id = batch._id;
            student.batch_selected = batch.name;

            if (oldBatchId && oldBatchId.toString() !== batchId) {
                await Batch.findByIdAndUpdate(oldBatchId, {
                    $pull: { studentsAssigned: student._id }
                });
            }

            if (!batch.studentsAssigned.includes(student._id)) {
                batch.studentsAssigned.push(student._id);
                await batch.save();
            }
        } else {
            student.batch_id = undefined;
            student.batch_selected = '';

            if (oldBatchId) {
                await Batch.findByIdAndUpdate(oldBatchId, {
                    $pull: { studentsAssigned: student._id }
                });
            }
        }

        await student.save();
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const sendCustomEmail = async (req, res) => {
    try {
        const { subject, message, adminName } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const nodemailer = require('nodemailer');
        const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
        const port = parseInt(process.env.SMTP_PORT || '587');
        const secure = port === 465;
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user: process.env.SMTP_USER || 'dummy_user',
                pass: process.env.SMTP_PASS || 'dummy_pass'
            }
        });

        const mailOptions = {
            from: `"EDSEC" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
            to: student.email,
            subject: subject,
            text: message,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</div>`
        };

        await transporter.sendMail(mailOptions);

        if (!student.communication_history) student.communication_history = [];
        student.communication_history.push({
            type: 'email',
            subject,
            message,
            status: 'Sent',
            sender: adminName || 'Admin',
            timestamp: new Date()
        });

        await student.save();
        res.json({ message: 'Email sent successfully!' });
    } catch (err) {
        console.error('Send custom email error:', err.message);
        res.status(500).send('Server Error sending email');
    }
};

module.exports = {
    enrollStudent,
    getStudents,
    updatePaymentStatus,
    deleteStudent,
    acceptStudent,
    loginStudent,
    updateStudentDetails,
    updateStudentStatus,
    addStudentNote,
    assignStudentBatch,
    sendCustomEmail
};
