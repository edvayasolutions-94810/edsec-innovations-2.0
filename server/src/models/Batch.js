const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    facultyAssigned: {
        type: String,
        default: ''
    },
    capacity: {
        type: Number,
        required: true
    },
    studentsAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming'
    },
    notes: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Batch', BatchSchema);
