const Batch = require('../models/Batch');

// @route   GET /api/batches
// @desc    Get all batches
// @access  Public
const getBatches = async (req, res) => {
    try {
        const batches = await Batch.find().sort({ startDate: 1 });
        res.json(batches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/batches/active
// @desc    Get active batches for enrollment form
// @access  Public
const getActiveBatches = async (req, res) => {
    try {
        const batches = await Batch.find({ isActive: true }).sort({ startDate: 1 });
        res.json(batches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/batches
// @desc    Create a new batch
// @access  Private (Admin)
const createBatch = async (req, res) => {
    try {
        const { courseName, startDate, endDate, availableSeats, isActive } = req.body;

        const newBatch = new Batch({
            courseName,
            startDate,
            endDate,
            availableSeats,
            isActive
        });

        const batch = await newBatch.save();
        res.json(batch);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/batches/:id
// @desc    Update a batch
// @access  Private (Admin)
const updateBatch = async (req, res) => {
    try {
        let batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        const { courseName, startDate, endDate, availableSeats, isActive } = req.body;

        batch = await Batch.findByIdAndUpdate(
            req.params.id,
            { $set: { courseName, startDate, endDate, availableSeats, isActive } },
            { new: true }
        );

        res.json(batch);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/batches/:id
// @desc    Delete a batch
// @access  Private (Admin)
const deleteBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        await batch.deleteOne();
        res.json({ message: 'Batch removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getBatches,
    getActiveBatches,
    createBatch,
    updateBatch,
    deleteBatch
};
