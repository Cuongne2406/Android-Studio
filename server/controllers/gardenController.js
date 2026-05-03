const asyncHandler = require('express-async-handler');
const Garden = require('../models/Garden');
const { createLog } = require('./logController');

const getMyGarden = asyncHandler(async (req, res) => {
    const garden = await Garden.find({ userId: req.user._id });
    res.json(garden);
});

const addPlantToGarden = asyncHandler(async (req, res) => {
    const { plantName, notes, imageUrl } = req.body;
    
    if (!plantName) {
        res.status(400);
        throw new Error('Vui lòng nhập tên cây');
    }
    
    const plant = await Garden.create({
        userId: req.user._id,
        plantName,
        notes,
        imageUrl: imageUrl || 'https://cdn-icons-png.flaticon.com/512/628/628283.png',
        waterStatus: 'Stable'
    });
    
    await createLog(req.user._id, 'INITIALIZE', plantName, 'New neural node synchronized to hub.');
    
    res.status(201).json(plant);
});

const updatePlantInGarden = asyncHandler(async (req, res) => {
    const plant = await Garden.findById(req.params.id);
    
    if (!plant) {
        res.status(404);
        throw new Error('Không tìm thấy cây trong vườn');
    }
    
    if (plant.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Không có quyền thao tác');
    }
    
    const updatedPlant = await Garden.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    
    await createLog(req.user._id, 'OPTIMIZE', updatedPlant.plantName, `Node parameters modified. Status: ${updatedPlant.waterStatus}`);
    
    res.json(updatedPlant);
});

const removePlantFromGarden = asyncHandler(async (req, res) => {
    const plant = await Garden.findById(req.params.id);
    
    if (!plant) {
        res.status(404);
        throw new Error('Không tìm thấy cây trong vườn');
    }
    
    if (plant.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Không có quyền thao tác');
    }
    
    await plant.deleteOne();
    
    await createLog(req.user._id, 'EJECT', plant.plantName, 'Neural node removed from system command.');
    
    res.json({ id: req.params.id });
});

module.exports = {
    getMyGarden,
    addPlantToGarden,
    updatePlantInGarden,
    removePlantFromGarden
};
