const express = require('express');
const router = express.Router();
const {addBrand,getBrands,getBrandById,updateBrand,deleteBrand,} = require('../controllers/brand.js');
const {isAdmin}=require('../middlewares/isAdmin.js');
const { verifyJWT } = require('../middlewares/auth');

router.get('/get-brands', getBrands);
router.get('/get-brand/:id', getBrandById);

// Protected routes for admin users
router.post('/add-brand',verifyJWT,isAdmin,addBrand);
router.put('/update-brand/:id', verifyJWT,isAdmin,updateBrand);
router.delete('/delete-brand/:id', verifyJWT,isAdmin,deleteBrand);

module.exports={router}