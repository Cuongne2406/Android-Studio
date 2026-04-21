const asyncHandler = require('express-async-handler');
const Friend = require('../models/Friend');

// @desc    Get all friends
// @route   GET /api/friends
const getFriends = asyncHandler(async (req, res) => {
    const friends = await Friend.find({}).sort({ createdAt: -1 });
    res.json(friends);
});

// @desc    Get friend by ID
// @route   GET /api/friends/:id
const getFriendById = asyncHandler(async (req, res) => {
    const friend = await Friend.findById(req.params.id);
    if (friend) {
        res.json(friend);
    } else {
        res.status(404);
        throw new Error('Friend not found');
    }
});

// @desc    Create a friend
// @route   POST /api/friends
const createFriend = asyncHandler(async (req, res) => {
    const { name, email, phone, avatar, description } = req.body;

    const friend = new Friend({
        name,
        email,
        phone,
        avatar,
        description
    });

    const createdFriend = await friend.save();
    
    // Emit socket event for real-time update
    if (req.io) {
        req.io.emit('update_friends', createdFriend);
    }

    res.status(201).json(createdFriend);
});

// @desc    Update a friend
// @route   PUT /api/friends/:id
const updateFriend = asyncHandler(async (req, res) => {
    const { name, email, phone, avatar, description } = req.body;

    const friend = await Friend.findById(req.params.id);

    if (friend) {
        friend.name = name || friend.name;
        friend.email = email || friend.email;
        friend.phone = phone || friend.phone;
        friend.avatar = avatar || friend.avatar;
        friend.description = description || friend.description;

        const updatedFriend = await friend.save();
        
        if (req.io) {
            req.io.emit('update_friends', updatedFriend);
        }

        res.json(updatedFriend);
    } else {
        res.status(404);
        throw new Error('Friend not found');
    }
});

// @desc    Delete a friend
// @route   DELETE /api/friends/:id
const deleteFriend = asyncHandler(async (req, res) => {
    const friend = await Friend.findById(req.params.id);

    if (friend) {
        await friend.deleteOne();
        
        if (req.io) {
            req.io.emit('update_friends', { id: req.params.id, deleted: true });
        }

        res.json({ message: 'Friend removed' });
    } else {
        res.status(404);
        throw new Error('Friend not found');
    }
});

module.exports = {
    getFriends,
    getFriendById,
    createFriend,
    updateFriend,
    deleteFriend
};
