const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Course = require('../models/Course');
const Syllabus = require('../models/Syllabus');

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

module.exports = {
    downloadSyllabusPDF
};
