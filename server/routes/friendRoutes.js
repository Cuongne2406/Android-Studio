const express = require('express');
const router = express.Router();
const {
    getFriends,
    getFriendById,
    createFriend,
    updateFriend,
    deleteFriend
} = require('../controllers/friendController');

router.route('/')
    .get(getFriends)
    .post(createFriend);

router.route('/:id')
    .get(getFriendById)
    .put(updateFriend)
    .delete(deleteFriend);

module.exports = router;
