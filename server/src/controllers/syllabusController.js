const Syllabus = require('../models/Syllabus');

// @route   POST /api/syllabus
// @desc    Create syllabus item for a course
// @access  Private (Admin)
const createSyllabus = async (req, res) => {
    try {
        const { course_id, topic, details, pdf_link } = req.body;

        const newItem = new Syllabus({
            course_id,
            topic,
            details,
            pdf_link
        });

        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/syllabus/:id
// @desc    Update syllabus item
// @access  Private (Admin)
const updateSyllabus = async (req, res) => {
    try {
        let item = await Syllabus.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Syllabus item not found' });
        }

        const { topic, details, pdf_link } = req.body;

        item = await Syllabus.findByIdAndUpdate(
            req.params.id,
            { $set: { topic, details, pdf_link } },
            { new: true }
        );

        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/syllabus/:id
// @desc    Delete syllabus item
// @access  Private (Admin)
const deleteSyllabus = async (req, res) => {
    try {
        const item = await Syllabus.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Syllabus item not found' });
        }

        await item.deleteOne();
        res.json({ message: 'Syllabus item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createSyllabus,
    updateSyllabus,
    deleteSyllabus
};
