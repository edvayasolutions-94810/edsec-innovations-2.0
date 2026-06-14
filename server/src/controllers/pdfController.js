const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Course = require('../models/Course');
const Syllabus = require('../models/Syllabus');
const Student = require('../models/Student');

// @route   GET /api/courses/:id/syllabus-pdf
// @desc    Download syllabus as PDF
// @access  Public (Checked by backend flag)
const downloadSyllabusPDF = async (req, res) => {
    try {
        // Try finding by ID first, then fallback to finding by title (to support URL slugs like 'full-stack-web-development')
        const searchTitle = req.params.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        let course;

        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            course = await Course.findById(req.params.id);
        } else {
            course = await Course.findOne({ title: new RegExp(searchTitle, 'i') });
        }

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Security check for the admin toggle flag
        if (!course.syllabus_download_enabled) {
            return res.status(403).json({ message: 'Syllabus download is currently disabled for this course.' });
        }

        const syllabus = await Syllabus.find({ course_id: course._id });

        // Generate PDF on the fly
        const doc = new PDFDocument({ margin: 50 });

        // Setup response headers
        res.setHeader('Content-disposition', `attachment; filename="${course.title.replace(/\s+/g, '_')}_Syllabus.pdf"`);
        res.setHeader('Content-type', 'application/pdf');

        // Pipe the PDF directly to the response
        doc.pipe(res);

        // PDF Content
        doc.fontSize(24).font('Helvetica-Bold').text(course.title, { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).font('Helvetica').text(`Domain: ${course.domain}`, { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(12).font('Helvetica').text(course.description);
        doc.moveDown(2);

        doc.fontSize(18).font('Helvetica-Bold').text('Course Syllabus');
        doc.moveDown();

        if (syllabus.length === 0) {
            doc.fontSize(12).font('Helvetica-Oblique').text('Syllabus details are being updated. Check back soon!');
        } else {
            syllabus.forEach((item, index) => {
                doc.fontSize(14).font('Helvetica-Bold').text(`Module ${index + 1}: ${item.module_name}`);
                doc.moveDown(0.5);
                doc.fontSize(12).font('Helvetica').text(item.content);
                doc.moveDown();
            });
        }

        // Finalize the PDF and end the stream
        doc.end();

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(500).send('Server Error generating PDF');
    }
};

const drawPDFAdmissionLetter = (doc, student) => {
    // Header / Logo area
    doc.rect(0, 0, 612, 15).fill('#0f172a'); // Slate header band
    
    doc.moveDown(2);
    doc.fillColor('#0f172a')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('EdSec Innovations', { align: 'center' });
       
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#64748b')
       .text('Building Careers in Technology & Business', { align: 'center' })
       .text('Email: admissions@edsecinnovations.com | Web: www.edsecinnovations.com', { align: 'center' });
    
    doc.moveDown(2);
    
    // Divider line
    doc.moveTo(50, doc.y).lineTo(562, doc.y).strokeColor('#e2e8f0').stroke();
    doc.moveDown(2);

    // Date
    const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.fontSize(11)
       .fillColor('#334155')
       .font('Helvetica-Bold')
       .text(`Date: ${dateStr}`, { align: 'right' });
       
    doc.moveDown();

    // Recipient Details
    doc.font('Helvetica-Bold').text('ADMISSION OFFER LETTER');
    doc.moveDown();
    doc.font('Helvetica-Bold').text(`To,`);
    doc.font('Helvetica').text(`${student.full_name}`);
    doc.text(`Email: ${student.email}`);
    doc.text(`Phone: ${student.phone}`);
    if (student.city && student.state) {
        doc.text(`${student.city}, ${student.state}`);
    }
    
    doc.moveDown(2);

    // Salutation & Subject
    doc.font('Helvetica-Bold').text(`Dear ${student.full_name},`);
    doc.moveDown();
    doc.font('Helvetica')
       .text(`We are pleased to offer you admission to EdSec Innovations for the program specified below. Congratulations on being selected for this intensive training and professional development program!`);
    
    doc.moveDown(1.5);

    // Program Details Table
    doc.font('Helvetica-Bold').text('Program Enrollment Details:', { underline: true });
    doc.moveDown(0.5);
    
    const details = [
        ['Enrollment ID:', student.enrollment_id || 'N/A'],
        ['Selected Program:', student.course_name || 'N/A'],
        ['Domain Selected:', student.domain || 'N/A'],
        ['Assigned Batch:', student.batch_selected || student.batch_name || 'N/A'],
        ['Enrollment Date:', student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : 'N/A'],
        ['Program Fee:', `INR ${student.program_fee || 0}`],
        ['Amount Paid:', `INR ${student.amount_paid || 0}`],
        ['Remaining Balance:', `INR ${student.remaining_balance || 0}`],
    ];

    details.forEach(([label, value]) => {
        doc.font('Helvetica-Bold').text(`  ${label.padEnd(25)}`, { continued: true })
           .font('Helvetica').text(value);
        doc.moveDown(0.3);
    });

    doc.moveDown(1.5);

    // Terms and Info
    doc.font('Helvetica-Bold').text('Terms and Conditions of Enrollment:');
    doc.font('Helvetica').fontSize(10)
       .list([
           'The student is expected to maintain at least 85% attendance during the program classes.',
           'Assignments and project assessments must be completed by the specified deadlines.',
           'Program certificates are only awarded upon passing the final assessment and resolving any remaining fee balances.',
           'The program fees paid are non-refundable.'
       ]);

    doc.moveDown(2.5);

    // Signature Area
    doc.fontSize(11).font('Helvetica-Bold').text('Authorized Signatory,', { align: 'right' });
    doc.moveDown(1.5);
    doc.text('________________________', { align: 'right' });
    doc.fontSize(10).font('Helvetica').text('EdSec Admissions Committee', { align: 'right' });
};

const generateAdmissionLetterPDF = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const doc = new PDFDocument({ margin: 50 });
        const filename = `${student.full_name.replace(/\s+/g, '_')}_Admission_Letter.pdf`;

        if (req.query.download === 'true') {
            res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        } else {
            res.setHeader('Content-disposition', `inline; filename="${filename}"`);
        }
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);
        drawPDFAdmissionLetter(doc, student);
        doc.end();

    } catch (err) {
        console.error('PDF Generation Error:', err.message);
        res.status(500).send('Server Error generating Admission Letter');
    }
};

const emailAdmissionLetterPDF = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(buffers);
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

            const filename = `${student.full_name.replace(/\s+/g, '_')}_Admission_Letter.pdf`;
            const mailOptions = {
                from: `"EDSEC" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
                to: student.email,
                subject: '🎉 Your Official EdSec Admission Letter',
                text: `Dear ${student.full_name},\n\nPlease find attached your official Admission Letter for the ${student.course_name} program.\n\nRegards,\nEdSec Admissions Committee`,
                html: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                    <h2>Dear ${student.full_name},</h2>
                    <p>Congratulations! We are pleased to attach your official <strong>Admission Offer Letter</strong> for the <strong>${student.course_name}</strong> program.</p>
                    <p>Please review the details in the attachment. If you have any questions, feel free to reply to this email.</p>
                    <br/>
                    <p>Regards,<br/><strong>EdSec Admissions Committee</strong></p>
                </div>`,
                attachments: [
                    {
                        filename: filename,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            };

            try {
                await transporter.sendMail(mailOptions);
                
                if (!student.communication_history) student.communication_history = [];
                student.communication_history.push({
                    type: 'email',
                    subject: '🎉 Your Official EdSec Admission Letter',
                    message: 'Official Admission Letter PDF attached and sent via email.',
                    status: 'Sent',
                    sender: req.body.adminName || 'Admin',
                    timestamp: new Date()
                });
                
                await student.save();
                res.json({ message: 'Admission letter emailed successfully!' });
            } catch (mailErr) {
                console.error('Mail Send Error:', mailErr.message);
                res.status(500).json({ error: 'Failed to send email: ' + mailErr.message });
            }
        });

        drawPDFAdmissionLetter(doc, student);
        doc.end();

    } catch (err) {
        console.error('Email PDF Error:', err.message);
        res.status(500).send('Server Error emailing Admission Letter');
    }
};

const drawPDFCertificate = (doc, student) => {
    // Draw background border
    doc.rect(20, 20, 752, 572).lineWidth(4).strokeColor('#0d9488').stroke();
    doc.rect(26, 26, 740, 560).lineWidth(1).strokeColor('#14b8a6').stroke();

    // Header
    doc.moveDown(4);
    doc.fillColor('#0f172a')
       .fontSize(36)
       .font('Helvetica-Bold')
       .text('EDSEC INNOVATIONS', { align: 'center' });
       
    doc.moveDown(0.5);
    doc.fontSize(14)
       .font('Helvetica-Oblique')
       .fillColor('#64748b')
       .text('Certificate of Course Completion', { align: 'center' });
       
    doc.moveDown(2);
    doc.fontSize(16)
       .font('Helvetica')
       .fillColor('#334155')
       .text('This is proudly presented to', { align: 'center' });
       
    doc.moveDown(1);
    doc.fontSize(28)
       .font('Helvetica-Bold')
       .fillColor('#0d9488')
       .text(student.full_name, { align: 'center' });
       
    // Divider line
    doc.moveDown(0.5);
    doc.moveTo(200, doc.y).lineTo(592, doc.y).strokeColor('#e2e8f0').stroke();
    doc.moveDown(1.5);
    
    const courseTitle = student.course_name || 'Technical Program';
    doc.fontSize(14)
       .font('Helvetica')
       .fillColor('#334155')
       .text('for successfully completing the advanced training program in', { align: 'center' });
       
    doc.moveDown(0.5);
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#0f172a')
       .text(courseTitle, { align: 'center' });
       
    if (student.domain) {
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#64748b')
           .text(`Specialization Domain: ${student.domain}`, { align: 'center' });
    }
    
    doc.moveDown(1);
    const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#64748b')
       .text(`Enrollment ID: ${student.enrollment_id || 'N/A'} | Date: ${dateStr}`, { align: 'center' });
       
    doc.moveDown(3);
    
    // Signatures
    const sigY = doc.y;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#334155').text('Program Director', 100, sigY);
    doc.moveTo(100, sigY - 10).lineTo(230, sigY - 10).strokeColor('#cbd5e1').stroke();
    
    doc.font('Helvetica-Bold').text('Academic Committee', 542, sigY, { align: 'right' });
    doc.moveTo(542, sigY - 10).lineTo(692, sigY - 10).strokeColor('#cbd5e1').stroke();
};

const generateCertificatePDF = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const doc = new PDFDocument({ layout: 'landscape', size: 'letter', margin: 50 });
        const filename = `${student.full_name.replace(/\s+/g, '_')}_Completion_Certificate.pdf`;

        if (req.query.download === 'true') {
            res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        } else {
            res.setHeader('Content-disposition', `inline; filename="${filename}"`);
        }
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);
        drawPDFCertificate(doc, student);
        doc.end();

    } catch (err) {
        console.error('PDF Certificate Error:', err.message);
        res.status(500).send('Server Error generating Certificate');
    }
};

const emailCertificatePDF = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const doc = new PDFDocument({ layout: 'landscape', size: 'letter', margin: 50 });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(buffers);
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

            const filename = `${student.full_name.replace(/\s+/g, '_')}_Completion_Certificate.pdf`;
            const mailOptions = {
                from: `"EDSEC" <${process.env.SMTP_USER || 'noreply@edsecinnovations.com'}>`,
                to: student.email,
                subject: '🎉 Your Official EdSec Completion Certificate',
                text: `Dear ${student.full_name},\n\nCongratulations on successfully completing the ${student.course_name} program! Please find attached your official Completion Certificate.\n\nRegards,\nEdSec Academic Committee`,
                html: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                    <h2>Dear ${student.full_name},</h2>
                    <p>Congratulations! We are proud to present you with your official <strong>Completion Certificate</strong> for the <strong>${student.course_name}</strong> program.</p>
                    <p>Your hard work and dedication have paid off. The certificate is attached to this email.</p>
                    <br/>
                    <p>Regards,<br/><strong>EdSec Academic Committee</strong></p>
                </div>`,
                attachments: [
                    {
                        filename: filename,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            };

            try {
                await transporter.sendMail(mailOptions);
                
                if (!student.communication_history) student.communication_history = [];
                student.communication_history.push({
                    type: 'email',
                    subject: '🎉 Your Official EdSec Completion Certificate',
                    message: 'Official Completion Certificate PDF attached and sent via email.',
                    status: 'Sent',
                    sender: req.body.adminName || 'Admin',
                    timestamp: new Date()
                });
                
                await student.save();
                res.json({ message: 'Certificate emailed successfully!' });
            } catch (mailErr) {
                console.error('Mail Send Error:', mailErr.message);
                res.status(500).json({ error: 'Failed to send email: ' + mailErr.message });
            }
        });

        drawPDFCertificate(doc, student);
        doc.end();

    } catch (err) {
        console.error('Email Certificate Error:', err.message);
        res.status(500).send('Server Error emailing Certificate');
    }
};

module.exports = {
    downloadSyllabusPDF,
    generateAdmissionLetterPDF,
    emailAdmissionLetterPDF,
    drawPDFAdmissionLetter,
    drawPDFCertificate,
    generateCertificatePDF,
    emailCertificatePDF
};
