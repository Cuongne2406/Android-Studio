const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Đang xử lý' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
