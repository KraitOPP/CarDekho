const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/isAdmin');
const { getAdminStats } = require('../controllers/admin.js');
const { verifyJWT } = require('../middlewares/auth');
router.get('/stats', verifyJWT,isAdmin,getAdminStats);

module.exports = {router};
