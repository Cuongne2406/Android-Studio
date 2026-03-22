const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, mssv, password } = req.body;
    const userExists = await User.findOne({ mssv });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, mssv, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            mssv: user.mssv,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { mssv, password } = req.body;
    const user = await User.findOne({ mssv });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            mssv: user.mssv,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid mssv or password');
    }
});

module.exports = { registerUser, authUser };
