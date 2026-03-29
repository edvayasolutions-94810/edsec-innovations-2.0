const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin, loginStudent } = require('../controllers/authController');

// Admin Auth
router.post('/admin/login', loginAdmin);
router.post('/admin/register', registerAdmin); // Ideally this should be protected or removed in prod

// Student Auth
router.post('/student/login', loginStudent);

module.exports = router;
