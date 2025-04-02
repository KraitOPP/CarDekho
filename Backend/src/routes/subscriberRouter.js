const express = require('express');
const router = express.Router();
const { getAllSubscribers, addSubscriber, deleteSubscriber, updateSubscriberStatus } = require('../controllers/subscriber.js');
const {verifyJWT}=require('../middlewares/auth.js')
const {isAdmin}=require('../middlewares/isAdmin.js')
router.get('/all-sub',verifyJWT,isAdmin, getAllSubscribers);
router.post('/add-sub',verifyJWT,isAdmin, addSubscriber);
router.delete('/delete-sub/:id',verifyJWT,isAdmin, deleteSubscriber);
router.patch('/update-sub/:id',verifyJWT,isAdmin, updateSubscriberStatus);

module.exports = {router};
