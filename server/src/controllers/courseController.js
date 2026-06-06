const Course = require('../models/Course');
const Syllabus = require('../models/Syllabus');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const syllabus = await Syllabus.find({ course_id: req.params.id });
        res.json({ course, syllabus });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/courses
// @desc    Create a course
// @access  Private (Admin)
const createCourse = async (req, res) => {
    try {
        const { title, description, price, domain } = req.body;

        const newCourse = new Course({
            title,
            description,
            price,
            domain
        });

        const course = await newCourse.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private (Admin)
const updateCourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const { title, description, price, domain, syllabus_download_enabled } = req.body;

        course = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, price, domain, syllabus_download_enabled } },
            { new: true }
        );

        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PATCH /api/courses/:id/toggle-syllabus
// @desc    Toggle syllabus download for a course
// @access  Private (Admin)
const toggleSyllabusDownload = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.syllabus_download_enabled = !course.syllabus_download_enabled;
        await course.save();

        res.json({ message: 'Syllabus download status updated', enabled: course.syllabus_download_enabled });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};



// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private (Admin)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.deleteOne();
        await Syllabus.deleteMany({ course_id: req.params.id }); // Also delete related syllabus
        res.json({ message: 'Course removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    toggleSyllabusDownload
};
