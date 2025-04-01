// routes.js
const express = require('express');
const router = express.Router();
const { signup, login, getCurrUser, logout, updateProfile } = require('../controllers/user.js');
const {addBrand,getBrands,getBrandById,updateBrand,deleteBrand,} = require('../controllers/brand.js');
const {isAdmin}=require('../middlewares/isAdmin.js');
const { verifyJWT } = require('../middlewares/auth');


router.post('/signup', signup);
router.post('/login', login);
router.get('/curr-user', verifyJWT, getCurrUser);
router.put('/update-user', verifyJWT, updateProfile);
router.post('/logout', verifyJWT, logout);
router.get('/brands', getBrands);
router.get('/brands/:id', getBrandById);

// Protected routes for admin users
router.post('/brands',verifyJWT,isAdmin,addBrand);
router.put('/brands/:id', verifyJWT,isAdmin,updateBrand);
router.delete('/brands/:id', verifyJWT,isAdmin,deleteBrand);


module.exports = { router };
