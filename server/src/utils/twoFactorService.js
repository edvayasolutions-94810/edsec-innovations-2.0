const axios = require('axios');

/**
 * Sanitize and extract a clean 10-digit Indian phone number.
 * Strips out spaces, dashes, parentheses, and leading country codes (+91, 91, or leading 0).
 */
const sanitizePhone = (phone) => {
    if (!phone) return '';
    let digits = String(phone).replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
        digits = digits.slice(2);
    } else if (digits.length === 11 && digits.startsWith('0')) {
        digits = digits.slice(1);
    } else if (digits.length > 10) {
        digits = digits.slice(-10);
    }
    return digits;
};

/**
 * Generate and dispatch an SMS OTP via 2Factor.in API.
 * Uses template name (e.g. 'RegistrationOTP' or custom brochure template).
 * Fallback to standard AUTOGEN endpoint if template fails.
 */
const generateOTP = async (phone, template) => {
    try {
        const apiKey = process.env.TF_API;
        if (!apiKey) {
            console.error('2Factor Error: TF_API environment variable is not configured');
            return {
                success: false,
                message: 'SMS service is not properly configured. Please contact support.'
            };
        }

        const cleanPhone = sanitizePhone(phone);
        if (!cleanPhone || cleanPhone.length !== 10) {
            return {
                success: false,
                message: 'Invalid mobile number. Please provide a 10-digit Indian phone number.'
            };
        }

        const templateName = template !== undefined ? template : (process.env.TF_TEMPLATE_NAME || 'RegistrationOTP');

        let url;
        if (templateName && templateName.trim()) {
            // Dispatches SMS using registered DLT template
            url = `https://2factor.in/API/V1/${apiKey}/SMS/+91${cleanPhone}/AUTOGEN/${encodeURIComponent(templateName.trim())}`;
        } else {
            // Standard AUTOGEN endpoint
            url = `https://2factor.in/API/V1/${apiKey}/SMS/+91${cleanPhone}/AUTOGEN`;
        }

        const response = await axios({
            method: 'get',
            url,
            timeout: 12000,
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = response.data;
        if (data && data.Status === 'Success') {
            return {
                success: true,
                sessionId: data.Details,
                message: 'OTP sent successfully via SMS'
            };
        }

        // If template dispatch fails, attempt standard AUTOGEN fallback
        if (templateName && templateName.trim()) {
            console.warn(`2Factor: Template '${templateName}' dispatch failed (${data?.Details}), trying standard AUTOGEN...`);
            const fallbackUrl = `https://2factor.in/API/V1/${apiKey}/SMS/+91${cleanPhone}/AUTOGEN`;
            const fallbackRes = await axios({
                method: 'get',
                url: fallbackUrl,
                timeout: 12000,
                headers: { 'Accept': 'application/json' }
            });
            if (fallbackRes.data && fallbackRes.data.Status === 'Success') {
                return {
                    success: true,
                    sessionId: fallbackRes.data.Details,
                    message: 'OTP sent successfully via SMS'
                };
            }
        }

        return {
            success: false,
            message: data?.Details || 'Failed to dispatch verification SMS'
        };
    } catch (err) {
        const errorDetail = err.response?.data?.Details || err.response?.data?.message || err.message;
        console.error('2Factor generateOTP error:', errorDetail);
        return {
            success: false,
            message: errorDetail || 'Failed to connect to SMS service'
        };
    }
};

/**
 * Verify OTP entered by the user against the session returned by 2Factor.in.
 */
const verifyOTP = async (sessionId, otp) => {
    try {
        const apiKey = process.env.TF_API;
        if (!apiKey) {
            return {
                success: false,
                message: 'SMS verification service not configured.'
            };
        }

        if (!sessionId || !otp) {
            return {
                success: false,
                message: 'Session ID and verification code are required.'
            };
        }

        const cleanOtp = String(otp).trim();
        const url = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${encodeURIComponent(sessionId)}/${encodeURIComponent(cleanOtp)}`;

        const response = await axios({
            method: 'get',
            url,
            timeout: 12000,
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = response.data;
        if (data && (data.Status === 'Success' || data.Details === 'OTP Matched')) {
            return {
                success: true,
                message: 'Verification successful'
            };
        }

        return {
            success: false,
            message: data?.Details || 'Invalid or expired verification code'
        };
    } catch (err) {
        const errorDetail = err.response?.data?.Details || err.response?.data?.message || err.message;
        console.error('2Factor verifyOTP error:', errorDetail);
        return {
            success: false,
            message: errorDetail || 'Verification failed. Please check the code.'
        };
    }
};

module.exports = {
    sanitizePhone,
    generateOTP,
    verifyOTP
};
