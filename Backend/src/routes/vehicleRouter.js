const express = require('express');
const router = express.Router();
const { addVehicle, getVehicle, getAllVehicle, deleteVehicle, updateVehicle } = require('../controllers/vehicle.js');
const {upload} = require('../middlewares/cloudinary.js'); // Fixed path
const { verifyJWT } = require('../middlewares/auth.js');
const { isAdmin } = require('../middlewares/isAdmin.js');

router.post('/add-vehicle', verifyJWT, isAdmin, upload.array('images', 5), addVehicle);
router.put('/update-vehicle/:id', verifyJWT, isAdmin, upload.array('images', 5), updateVehicle);
router.get('/get-vehicle/:id', getVehicle);
router.get('/get-vehicles', getAllVehicle); // Fixed function name
router.delete('/delete-vehicle/:id', verifyJWT, isAdmin, deleteVehicle);

module.exports = {router};
