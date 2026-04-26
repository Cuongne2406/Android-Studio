const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
});

const createOrder = asyncHandler(async (req, res) => {
    const { items, totalPrice } = req.body;
    
    if (!items || items.length === 0) {
        res.status(400);
        throw new Error('Giỏ hàng trống');
    }
    
    const order = await Order.create({
        userId: req.user._id,
        items,
        totalPrice
    });
    
    res.status(201).json(order);
});

module.exports = {
    getMyOrders,
    createOrder
};
