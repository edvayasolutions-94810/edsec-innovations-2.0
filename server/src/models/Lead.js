const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: {
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
    phone: {
        type: String,
        required: true,
        trim: true
    },
    programId: {
        type: String,
        required: true,
        trim: true
    },
    otpHash: {
        type: String
    },
    otpExpiresAt: {
        type: Date
    },
    twoFactorSessionId: {
        type: String,
        default: null
    },
    otpAttempts: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    downloadTokenHash: {
        type: String
    },
    downloadTokenExpiresAt: {
        type: Date
    },
    downloadTokenUsed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Composite index for fast lookup of lead by email & program
LeadSchema.index({ email: 1, programId: 1 });
// Index for download token verification
LeadSchema.index({ downloadTokenHash: 1 });

module.exports = mongoose.model('Lead', LeadSchema);
