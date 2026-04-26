const asyncHandler = require('express-async-handler');
const Plant = require('../models/Plant');

const getPlants = asyncHandler(async (req, res) => {
    const plants = await Plant.find({});
    res.json(plants);
});

module.exports = {
    getPlants
};
