const Batch = require('../models/Batch');

// @route   GET /api/batches
// @desc    Get all batches
// @access  Private (Admin)
const getBatches = async (req, res) => {
    try {
        const batches = await Batch.find()
            .populate('studentsAssigned', 'full_name email enrollment_id status phone course_name')
            .sort({ startDate: -1 });
        res.json(batches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/batches/active
// @desc    Get active batches for enrollment form / dropdowns
// @access  Public
const getActiveBatches = async (req, res) => {
    try {
        const batches = await Batch.find({ isActive: true })
            .populate('studentsAssigned', 'full_name email enrollment_id status')
            .sort({ startDate: 1 });
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
        const { name, courseName, facultyAssigned, capacity, startDate, endDate, status, notes, isActive } = req.body;

        const newBatch = new Batch({
            name,
            courseName,
            facultyAssigned,
            capacity,
            startDate,
            endDate,
            status,
            notes,
            isActive: isActive !== undefined ? isActive : true
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

        const { name, courseName, facultyAssigned, capacity, startDate, endDate, status, notes, isActive } = req.body;

        batch = await Batch.findByIdAndUpdate(
            req.params.id,
            { 
                $set: { 
                    name, 
                    courseName, 
                    facultyAssigned, 
                    capacity, 
                    startDate, 
                    endDate, 
                    status, 
                    notes, 
                    isActive 
                } 
            },
            { new: true }
        ).populate('studentsAssigned', 'full_name email enrollment_id status');

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

        // Unlink from students
        const Student = require('../models/Student');
        await Student.updateMany(
            { batch_id: batch._id },
            { $set: { batch_id: undefined, batch_selected: '' } }
        );

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
