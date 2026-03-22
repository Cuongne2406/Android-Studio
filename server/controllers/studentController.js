const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');

// @desc    Fetch all students
// @route   GET /api/students
// @access  Public
const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({});
    res.json(students);
});

// @desc    Fetch single student
// @route   GET /api/students/:id
// @access  Public
const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        res.json(student);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

module.exports = { getStudents, getStudentById };
