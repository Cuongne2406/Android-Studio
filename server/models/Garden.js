const mongoose = require('mongoose');

const gardenSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plantName: { type: String, required: true },
    waterStatus: { type: String, default: 'Cần tưới' }, // 'Cần tưới' or 'Đã tưới'
    notes: { type: String, default: '' },
    imageUrl: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/628/628283.png' }
}, { timestamps: true });

module.exports = mongoose.model('Garden', gardenSchema);
