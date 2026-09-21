const bcrypt = require('bcrypt');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const { sendBrochureOtpEmail } = require('../utils/emailService');
const { generateOTP, verifyOTP, sanitizePhone } = require('../utils/twoFactorService');

// In-memory rate limiting map: key = `${email}:${ip}` -> array of request timestamps
const otpRateLimitMap = new Map();

// Clean up stale rate limit entries every 15 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of otpRateLimitMap.entries()) {
        const recent = timestamps.filter(ts => now - ts < 10 * 60 * 1000);
        if (recent.length === 0) {
            otpRateLimitMap.delete(key);
        } else {
            otpRateLimitMap.set(key, recent);
        }
    }
}, 15 * 60 * 1000);

const PROGRAM_TITLES = {
    'full-stack-web-dev': 'Full Stack Web Development',
    'generative-ai': 'Generative AI',
    'python-ai-ml': 'Python with AI/ML',
    'git-resume': 'Git & Resume'
};

const PROGRAM_BROCHURES = {
    'full-stack-web-dev': 'full-stack-web-development-brochure.pdf',
    'generative-ai': 'generative-ai-brochure.pdf',
    'python-ai-ml': 'python-ai-ml-brochure.pdf',
    'git-resume': 'git-resume-brochure.pdf'
};

const normalizeProgramId = (id) => {
    if (!id) return '';
    const clean = id.toLowerCase().trim();
    if (clean === 'full-stack-web-development') return 'full-stack-web-dev';
    if (clean === 'python-with-ai-ml') return 'python-ai-ml';
    return clean;
};

/**
 * Handler 1: Request OTP for Brochure Download via 2Factor SMS
 * POST /api/brochures/request-otp
 */
const requestOtp = async (req, res) => {
    try {
        const { name, email, phone, programId } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Name is required.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email.trim())) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
        }

        const cleanPhone = sanitizePhone(phone);
        if (!cleanPhone || cleanPhone.length !== 10) {
            return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian mobile number.' });
        }

        const normId = normalizeProgramId(programId);
        if (!normId || !PROGRAM_BROCHURES[normId]) {
            return res.status(400).json({ success: false, message: 'Invalid program selected.' });
        }

        // Rate limiting: max 3 requests per 10 minutes per phone/email + IP
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const rateLimitKey = `${cleanPhone}:${email.toLowerCase().trim()}:${clientIp}`;
        const now = Date.now();
        const existingTimestamps = otpRateLimitMap.get(rateLimitKey) || [];
        const recentTimestamps = existingTimestamps.filter(ts => now - ts < 10 * 60 * 1000);

        if (recentTimestamps.length >= 3) {
            return res.status(429).json({
                success: false,
                message: 'Too many verification code requests. Please wait 10 minutes before requesting again.'
            });
        }

        recentTimestamps.push(now);
        otpRateLimitMap.set(rateLimitKey, recentTimestamps);

        // Ensure database connection
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database service is currently unavailable. Please try again later.'
            });
        }

        // Dispatch SMS OTP via 2Factor
        const templateName = process.env.TF_TEMPLATE_NAME || 'RegistrationOTP';
        const otpResult = await generateOTP(cleanPhone, templateName);

        if (!otpResult.success) {
            return res.status(400).json({
                success: false,
                message: otpResult.message || 'Failed to dispatch verification SMS. Please check your mobile number.'
            });
        }

        const otpExpiresAt = new Date(now + 10 * 60 * 1000); // 10 minutes validity

        // Upsert Lead record in database with 2Factor session ID
        await Lead.findOneAndUpdate(
            { email: email.toLowerCase().trim(), programId: normId },
            {
                name: name.trim(),
                phone: cleanPhone,
                twoFactorSessionId: otpResult.sessionId,
                otpExpiresAt,
                otpAttempts: 0,
                verified: false,
                downloadTokenHash: null,
                downloadTokenExpiresAt: null,
                downloadTokenUsed: false
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({
            success: true,
            sessionId: otpResult.sessionId,
            phone: cleanPhone,
            message: `Verification code sent via SMS to +91 ${cleanPhone.slice(0, 2)}******${cleanPhone.slice(-2)}.`
        });
    } catch (error) {
        console.error('Error in requestOtp:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send verification code. Please try again.'
        });
    }
};

/**
 * Handler 2: Verify OTP and Issue Download Token
 * POST /api/brochures/verify-otp
 */
const verifyOtp = async (req, res) => {
    try {
        const { email, phone, programId, otp, sessionId } = req.body;

        if (!otp || !otp.trim()) {
            return res.status(400).json({ success: false, message: 'Verification code is required.' });
        }

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database service is currently unavailable. Please try again later.'
            });
        }

        const normId = normalizeProgramId(programId);
        const cleanPhone = phone ? sanitizePhone(phone) : '';
        
        // Find lead by email or phone
        let lead = null;
        if (email) {
            lead = await Lead.findOne({ email: email.toLowerCase().trim(), programId: normId });
        }
        if (!lead && cleanPhone) {
            lead = await Lead.findOne({ phone: cleanPhone, programId: normId });
        }

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'No verification session found. Please request a new code.'
            });
        }

        // Cap wrong attempts at 5
        if (lead.otpAttempts >= 5) {
            return res.status(429).json({
                success: false,
                message: 'Maximum verification attempts exceeded. Please request a fresh verification code.'
            });
        }

        // Check expiration
        if (!lead.otpExpiresAt || new Date() > lead.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'Verification code has expired. Please request a new code.'
            });
        }

        // Verify with 2Factor
        const verifySessionId = sessionId || lead.twoFactorSessionId;
        if (!verifySessionId) {
            return res.status(400).json({
                success: false,
                message: 'Verification session expired. Please request a fresh code.'
            });
        }

        const verifyResult = await verifyOTP(verifySessionId, otp.trim());
        if (!verifyResult.success) {
            lead.otpAttempts = (lead.otpAttempts || 0) + 1;
            await lead.save();

            const remaining = Math.max(0, 5 - lead.otpAttempts);
            if (remaining === 0) {
                return res.status(429).json({
                    success: false,
                    message: 'Maximum verification attempts exceeded. Please request a fresh code.'
                });
            }

            return res.status(400).json({
                success: false,
                message: verifyResult.message || `Incorrect verification code. ${remaining} attempt(s) remaining.`
            });
        }

        // OTP Verified successfully! Generate one-time download token
        const downloadToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(downloadToken).digest('hex');

        lead.verified = true;
        lead.downloadTokenHash = tokenHash;
        lead.downloadTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes to download
        lead.downloadTokenUsed = false;
        lead.otpAttempts = 0;
        await lead.save();

        return res.status(200).json({
            success: true,
            token: downloadToken
        });
    } catch (error) {
        console.error('Error in verifyOtp:', error);
        return res.status(500).json({
            success: false,
            message: 'Verification failed. Please try again.'
        });
    }
};

/**
 * Handler 3: Download Brochure using One-Time Token
 * GET /api/brochures/download?token=...
 */
const downloadBrochure = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token || typeof token !== 'string') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Valid download token required.'
            });
        }

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database service is currently unavailable. Please try again later.'
            });
        }

        const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
        const lead = await Lead.findOne({ downloadTokenHash: tokenHash });

        if (!lead) {
            return res.status(403).json({
                success: false,
                message: 'Invalid download token.'
            });
        }

        if (lead.downloadTokenUsed) {
            return res.status(403).json({
                success: false,
                message: 'This download token has already been used. Please request a new verification code.'
            });
        }

        if (!lead.downloadTokenExpiresAt || new Date() > lead.downloadTokenExpiresAt) {
            return res.status(403).json({
                success: false,
                message: 'This download token has expired. Please request a new verification code.'
            });
        }

        // Mark token as used immediately to ensure single-use
        lead.downloadTokenUsed = true;
        await lead.save();

        const filename = PROGRAM_BROCHURES[lead.programId];
        if (!filename) {
            return res.status(404).json({
                success: false,
                message: 'Requested brochure file not configured.'
            });
        }

        const filePath = path.join(__dirname, '../../private/brochures', filename);

        if (!fs.existsSync(filePath)) {
            console.error('Brochure file missing on disk:', filePath);
            return res.status(404).json({
                success: false,
                message: 'Brochure file currently unavailable.'
            });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Error in downloadBrochure:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while streaming brochure.'
        });
    }
};

/**
 * Handler 4: Admin Get All Brochure Leads
 * GET /api/brochures/leads
 * @access Private (Admin)
 */
const getBrochureLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            leads
        });
    } catch (error) {
        console.error('Error in getBrochureLeads:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching brochure leads.'
        });
    }
};

/**
 * Handler 5: Admin Delete Brochure Lead
 * DELETE /api/brochures/leads/:id
 * @access Private (Admin)
 */
const deleteBrochureLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found.'
            });
        }
        res.json({
            success: true,
            message: 'Lead record deleted successfully.'
        });
    } catch (error) {
        console.error('Error in deleteBrochureLead:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting lead.'
        });
    }
};

module.exports = {
    requestOtp,
    verifyOtp,
    downloadBrochure,
    getBrochureLeads,
    deleteBrochureLead
};

