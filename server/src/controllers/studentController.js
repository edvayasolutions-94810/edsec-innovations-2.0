const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const { sendEnrollmentEmail } = require('../utils/emailService');

// @route   POST /api/students/enroll
// @desc    Enroll a new student
// @access  Public
const enrollStudent = async (req, res) => {
    try {
        const { full_name, email, phone, course_name, course_duration, domainSelected, price_paid, qualification, message } = req.body;

        let student = await Student.findOne({ email });
        if (student) {
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
            message
        });

        await student.save();

        // Send async email notification
        sendEnrollmentEmail(email, full_name, course_name);

        res.status(201).json({ message: 'Enrollment successful. We will contact you soon.' });
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

module.exports = {
    enrollStudent,
    getStudents,
    updatePaymentStatus,
    deleteStudent,
    acceptStudent,
    loginStudent
};
