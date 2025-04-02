// routes.js
const express = require('express');
const router = express.Router();
const { signup, login, getCurrUser, logout, updateProfile,getAllUsers } = require('../controllers/user.js');
const {isAdmin}=require('../middlewares/isAdmin.js');
const { verifyJWT } = require('../middlewares/auth');


router.post('/signup', signup);
router.post('/login', login);
router.get('/curr-user', verifyJWT, getCurrUser);
router.put('/update-user', verifyJWT, updateProfile);
router.post('/logout', verifyJWT, logout);

router.get('/all-user',verifyJWT,isAdmin,getAllUsers);



module.exports = { router };
