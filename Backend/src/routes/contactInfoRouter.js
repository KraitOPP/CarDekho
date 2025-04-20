const express = require('express');
const router = express.Router();
const {updateContactInfo,getContactInfo} = require('../controllers/contactInfo.js');
const { verifyJWT } = require('../middlewares/auth.js');
const { isAdmin } = require('../middlewares/isAdmin.js');


router.get('/',getContactInfo);
router.put('/update', verifyJWT, isAdmin, updateContactInfo);  

module.exports ={router};