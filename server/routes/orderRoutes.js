const express = require('express');
const router = express.Router();
const { getMyOrders, createOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMyOrders)
    .post(protect, createOrder);

module.exports = router;
