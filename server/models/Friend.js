const mongoose = require('mongoose');

const friendSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: '' },
    description: { type: String, default: '' },
}, {
    timestamps: true
});

const Friend = mongoose.model('Friend', friendSchema);
module.exports = Friend;
