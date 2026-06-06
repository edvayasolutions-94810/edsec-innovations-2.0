const express = require('express');
const router = express.Router();
const { getBatches, getActiveBatches, createBatch, updateBatch, deleteBatch } = require('../controllers/batchController');
const authMiddleware = require('../utils/authMiddleware');

// Public routes
router.get('/active', getActiveBatches);

// Protected routes (Admin only)
router.get('/', authMiddleware(['admin']), getBatches);
router.post('/', authMiddleware(['admin']), createBatch);
router.put('/:id', authMiddleware(['admin']), updateBatch);
router.delete('/:id', authMiddleware(['admin']), deleteBatch);

module.exports = router;
