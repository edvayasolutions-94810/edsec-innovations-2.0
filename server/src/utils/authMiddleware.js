const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        if (typeof roles === 'string') {
            roles = [roles];
        }

        const authHeader = req.header('Authorization');
        const token = authHeader?.startsWith('Bearer ') 
            ? authHeader.split(' ')[1] 
            : (authHeader || req.header('x-auth-token'));

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('FATAL: JWT_SECRET environment variable is not configured');
            return res.status(500).json({ message: 'Authentication service misconfigured' });
        }

        try {
            const decoded = jwt.verify(token, jwtSecret);
            if (!decoded || !decoded.user) {
                return res.status(401).json({ message: 'Invalid token structure' });
            }

            req.user = decoded.user;

            if (roles.length && (!req.user.role || !roles.includes(req.user.role))) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions' });
            }

            next();
        } catch (err) {
            return res.status(401).json({ message: 'Token is invalid or expired' });
        }
    };
};

module.exports = authMiddleware;
