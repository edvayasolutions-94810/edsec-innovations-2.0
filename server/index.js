require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/courses', require('./src/routes/courseRoutes'));
app.use('/api/courses', require('./src/routes/pdfRoutes')); // Overlap cleanly onto /api/courses
app.use('/api/students', require('./src/routes/studentRoutes'));
app.use('/api/syllabus', require('./src/routes/syllabusRoutes'));
app.use('/api/contact', require('./src/routes/contactRoutes'));
app.use('/api/batches', require('./src/routes/batchRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
