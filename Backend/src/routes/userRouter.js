// routes.js
const express = require('express');
const router = express.Router();
const { signup, login, getCurrUser, logout, updateProfile,getAllUsers, refresh,updatePassword,forgotPassword,resetPassword} = require('../controllers/user.js');
const {isAdmin}=require('../middlewares/isAdmin.js');
const { verifyJWT } = require('../middlewares/auth');
const {upload}=require('../middlewares/cloudinary.js')

router.get('/', verifyJWT, getCurrUser);
router.post('/signup', signup);
router.post('/signin', login);
router.post('/refresh', refresh);
router.post('/logout', verifyJWT, logout);
router.put('/update', verifyJWT, upload.fields([
    { name: 'aadhaar_image', maxCount: 1 },
    { name: 'license_image', maxCount: 1 }
  ]), updateProfile);
router.put('/update-password',verifyJWT,updatePassword)
router.get('/all', verifyJWT,isAdmin, getAllUsers);
router.post('/forgot-password',updatePassword);
router

module.exports = { router };
