const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/cloudinary.js');
const { verifyJWT } = require('../middlewares/auth.js');
const { isAdmin } = require('../middlewares/isAdmin.js');
const {
    addVehicleModel,
    getVehicleModel,
    getAllVehicleModels,
    updateVehicleModel,
    deleteVehicleModel
} = require('../controllers/vehicleModel.js');

router.post('/add-vehicle-model', verifyJWT, isAdmin, upload.array('images', 5), addVehicleModel);
router.get('/get-vehicle-model/:id', getVehicleModel);
router.get('/get-vehicle-models', getAllVehicleModels);
router.put('/update-vehicle-model/:id', verifyJWT, isAdmin, upload.array('images', 5), updateVehicleModel);
router.delete('/delete-vehicle-model/:id', verifyJWT, isAdmin, deleteVehicleModel);

module.exports = {router};
