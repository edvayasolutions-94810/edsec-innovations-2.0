const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');

// @route   POST /api/auth/admin/register (Protected / Restricted setup)
const registerAdmin = async (req, res) => {
    try {
        // Enforce registration secret check
        const registrationSecret = process.env.ADMIN_REGISTER_SECRET;
        const providedSecret = req.headers['x-admin-register-secret'] || req.body.registrationSecret;

        if (!registrationSecret || providedSecret !== registrationSecret) {
            return res.status(403).json({ 
                message: 'Admin registration is restricted. Please use the secure setup-admin.js CLI utility.' 
            });
        }

        const { email, password } = req.body;

        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return res.status(400).json({ message: 'Valid email and password are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        const cleanEmail = email.trim().toLowerCase();
        let admin = await Admin.findOne({ email: cleanEmail });
        if (admin) {
            return res.status(400).json({ message: 'Admin account already exists' });
        }

        const salt = await bcrypt.genSalt(12);
        const password_hash = await bcrypt.hash(password, salt);

        admin = new Admin({
            email: cleanEmail,
            username: cleanEmail,
            password_hash
        });

        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        console.error('Admin register error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @route   POST /api/auth/admin/login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Support lookup by email OR legacy username
        const admin = await Admin.findOne({ $or: [{ email: cleanEmail }, { username: cleanEmail }] });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('FATAL: JWT_SECRET environment variable is missing');
            return res.status(500).json({ message: 'Server authentication misconfiguration' });
        }

        const payload = {
            user: {
                id: admin.id,
                role: 'admin'
            }
        };

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '8h' },
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err.message);
                    return res.status(500).json({ message: 'Authentication error' });
                }
                res.json({ token, admin: { email: admin.email || admin.username } });
            }
        );
    } catch (err) {
        console.error('Admin login error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @route   POST /api/auth/student/login
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const student = await Student.findOne({ email: cleanEmail });
        if (!student || !student.password_hash) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, student.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('FATAL: JWT_SECRET environment variable is missing');
            return res.status(500).json({ message: 'Server authentication misconfiguration' });
        }

        const payload = {
            user: {
                id: student.id,
                role: 'student'
            }
        };

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err.message);
                    return res.status(500).json({ message: 'Authentication error' });
                }
                res.json({ token, role: 'student', student: { id: student.id, name: student.name, email: student.email, track: student.track, payment_status: student.payment_status } });
            }
        );
    } catch (err) {
        console.error('Student login error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    registerAdmin,
    loginAdmin,
    loginStudent
};
