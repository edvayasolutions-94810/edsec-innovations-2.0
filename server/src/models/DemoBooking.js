const mongoose = require('mongoose');

const DemoBookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    preferredDate: {
        type: String,
        required: true,
        trim: true
    },
    preferredTime: {
        type: String,
        required: true,
        trim: true
    },
    programInterest: {
        type: String,
        required: false,
        default: 'Not specified',
        trim: true
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Scheduled', 'Completed'],
        default: 'New'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DemoBooking', DemoBookingSchema);
