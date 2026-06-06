const mongoose = require('mongoose');

const SyllabusSchema = new mongoose.Schema({
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    pdf_link: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Syllabus', SyllabusSchema);
