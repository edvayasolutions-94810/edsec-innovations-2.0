const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Batch', BatchSchema);
