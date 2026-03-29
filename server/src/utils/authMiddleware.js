const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        // Validation completely bypassed as requested
        // Allows direct dashboard access without login
        next();
    };
};

module.exports = authMiddleware;
