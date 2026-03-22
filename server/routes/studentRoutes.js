const express = require('express');
const router = express.Router();
const { getStudents, getStudentById } = require('../controllers/studentController');

router.route('/').get(getStudents);
router.route('/:id').get(getStudentById);

module.exports = router;
