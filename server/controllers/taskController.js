const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');

// @desc    Get user tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
});

// @desc    Add a task
// @route   POST /api/tasks
// @access  Private
const addTask = asyncHandler(async (req, res) => {
    const { title, date, time } = req.body;

    const task = new Task({
        user: req.user._id,
        title,
        date,
        time,
        completed: false
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        if (task.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this task');
        }
        task.title = req.body.title || task.title;
        task.date = req.body.date || task.date;
        task.time = req.body.time || task.time;
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        if (task.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this task');
        }
        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
});

module.exports = { getTasks, addTask, updateTask, deleteTask };
