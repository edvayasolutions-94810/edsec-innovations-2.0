const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password_hash: {
        type: String,
        required: false
    },
    course_name: {
        type: String,
        required: true
    },
    course_duration: {
        type: String,
        required: false
    },
    domain: {
        type: String,
        required: false
    },
    batch_selected: {
        type: String,
        required: false
    },
    price_paid: {
        type: String,
        required: false
    },
    qualification: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    enrollment_date: {
        type: Date,
        default: Date.now
    },
    payment_status: {
        type: String,
        enum: ['Unpaid', 'Paid'],
        default: 'Unpaid'
    },
    status: {
        type: String,
        enum: ['Not Selected', 'Selected'],
        default: 'Not Selected'
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
