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
    whatsapp_number: {
        type: String,
        required: false
    },
    dob: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
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
    batch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: false
    },
    program_fee: {
        type: Number,
        default: 0
    },
    amount_paid: {
        type: Number,
        default: 0
    },
    remaining_balance: {
        type: Number,
        default: 0
    },
    qualification: {
        type: String,
        required: false
    },
    college_name: {
        type: String,
        required: false
    },
    university: {
        type: String,
        required: false
    },
    degree: {
        type: String,
        required: false
    },
    branch: {
        type: String,
        required: false
    },
    semester: {
        type: String,
        required: false
    },
    year_of_study: {
        type: String,
        required: false
    },
    graduation_year: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    enrollment_id: {
        type: String,
        unique: true,
        sparse: true
    },
    enrollment_date: {
        type: Date,
        default: Date.now
    },
    payment_status: {
        type: String,
        enum: ['Unpaid', 'Partially Paid', 'Paid'],
        default: 'Unpaid'
    },
    status: {
        type: String,
        enum: ['New Application', 'Under Review', 'Interview Scheduled', 'Approved', 'Rejected', 'On Hold', 'Completed'],
        default: 'New Application'
    },
    email_status: {
        type: String,
        default: 'Not Sent'
    },
    whatsapp_status: {
        type: String,
        default: 'Not Sent'
    },
    last_contacted_date: {
        type: Date
    },
    communication_history: [
        {
            type: { type: String, enum: ['email', 'whatsapp'] },
            subject: String,
            message: String,
            status: String,
            timestamp: { type: Date, default: Date.now },
            sender: { type: String, default: 'Admin' }
        }
    ],
    admin_notes: [
        {
            content: String,
            timestamp: { type: Date, default: Date.now },
            author: { type: String, default: 'Admin' }
        }
    ],
    status_history: [
        {
            status: String,
            timestamp: { type: Date, default: Date.now },
            updatedBy: { type: String, default: 'Admin' }
        }
    ]
}, { timestamps: true });

// Pre-save hook to generate enrollment_id and calculate remaining_balance / payment_status
StudentSchema.pre('save', function() {
    if (!this.enrollment_id) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        const year = new Date().getFullYear();
        this.enrollment_id = `EDSEC-${year}-${rand}`;
    }
    
    // Auto-compute payment states if program_fee or amount_paid is set
    if (this.program_fee !== undefined && this.amount_paid !== undefined) {
        this.remaining_balance = Math.max(0, this.program_fee - this.amount_paid);
        if (this.amount_paid === 0) {
            this.payment_status = 'Unpaid';
        } else if (this.remaining_balance <= 0) {
            this.payment_status = 'Paid';
        } else {
            this.payment_status = 'Partially Paid';
        }
    }
});

module.exports = mongoose.model('Student', StudentSchema);
