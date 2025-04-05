// routes.js
const express = require('express');
const router = express.Router();
const { signup, login, getCurrUser, logout, updateProfile,getAllUsers, refresh } = require('../controllers/user.js');
const {isAdmin}=require('../middlewares/isAdmin.js');
const { verifyJWT } = require('../middlewares/auth');


router.get('/', verifyJWT, getCurrUser);
router.post('/signup', signup);
router.post('/signin', login);
router.post('/refresh', refresh);
router.post('/logout', verifyJWT, logout);
router.put('/update', verifyJWT, updateProfile);


module.exports = { router };
