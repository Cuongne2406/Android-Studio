const express = require('express');
const router = express.Router();
const { getMyGarden, addPlantToGarden, updatePlantInGarden, removePlantFromGarden } = require('../controllers/gardenController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMyGarden)
    .post(protect, addPlantToGarden);

router.route('/:id')
    .put(protect, updatePlantInGarden)
    .delete(protect, removePlantFromGarden);

module.exports = router;
