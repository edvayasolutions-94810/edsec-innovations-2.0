const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');

// Verify critical environment configuration in production
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16)) {
    console.warn('⚠️ WARNING: JWT_SECRET should be at least 16 characters long for secure token signing.');
}

// Connect to MongoDB
connectDB();

const app = express();

// Disable X-Powered-By header
app.disable('x-powered-by');

// Security Headers via Helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Allowed origins configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://edsecinnovations.com',
    'https://www.edsecinnovations.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080'
].filter(Boolean);

// CORS Configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        // Check explicit whitelist
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // Allow EdSec-specific Render staging/preview deployments
        if (/^https:\/\/edsec[a-z0-9-]*\.onrender\.com$/.test(origin)) {
            return callback(null, true);
        }

        // Allow localhost in non-production environments
        if (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:[0-9]+$/.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error('CORS policy: Origin not permitted'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-register-secret']
}));

// Rate Limiting
const globalApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many authentication attempts. Please try again after 15 minutes.' }
});

const submissionRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Submission limit reached. Please wait a few minutes before submitting again.' }
});

// Apply Global Rate Limiter to all API routes
app.use('/api/', globalApiLimiter);

// Payload parsers with strict size limits (1MB to prevent DoS)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Root route for health check
app.get('/', (req, res) => {
    res.json({ status: 'online', message: 'EdSec API Backend is running securely' });
});

// Routes with targeted rate limiters
app.use('/api/auth', authRateLimiter, require('./src/routes/authRoutes'));
app.use('/api/courses', require('./src/routes/courseRoutes'));
app.use('/api/courses', require('./src/routes/pdfRoutes')); // Overlap cleanly onto /api/courses
app.use('/api/students/enroll', submissionRateLimiter);
app.use('/api/students', require('./src/routes/studentRoutes'));
app.use('/api/syllabus', require('./src/routes/syllabusRoutes'));
app.use('/api/contact', submissionRateLimiter, require('./src/routes/contactRoutes'));
app.use('/api/batches', require('./src/routes/batchRoutes'));
app.use('/api/brochures', submissionRateLimiter, require('./src/routes/brochureRoutes'));
app.use('/api/demo-bookings', submissionRateLimiter, require('./src/routes/demoBookingRoutes'));

// Central 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Requested resource not found' });
});

// Central error handler
app.use((err, req, res, next) => {
    if (err.message && err.message.includes('CORS policy')) {
        return res.status(403).json({ message: 'Access denied by CORS policy' });
    }
    console.error('Unhandled server error:', err.message);
    res.status(err.status || 500).json({
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
