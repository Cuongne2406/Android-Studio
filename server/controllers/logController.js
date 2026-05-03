const Log = require('../models/Log');
const asyncHandler = require('express-async-handler');

// @desc    Get all logs for a user
// @route   GET /api/logs
// @access  Private
const getLogs = asyncHandler(async (req, res) => {
    const logs = await Log.find({ userId: req.user._id })
        .sort({ timestamp: -1 })
        .limit(50);
    res.json(logs);
});

// Helper function to create logs (to be used in other controllers)
const createLog = async (userId, action, targetName, details) => {
    try {
        await Log.create({
            userId,
            action,
            targetName,
            details
        });
    } catch (error) {
        console.error('Error creating log:', error);
    }
};

module.exports = { getLogs, createLog };
