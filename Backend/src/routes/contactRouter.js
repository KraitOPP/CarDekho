const express = require('express');
const router = express.Router();
const {addContactQuery,getAllContactQueries,getPendingContactQueries,getContactQueryById,updateContactQueryStatus,deleteContactQuery,respondToQuery} = require('../controllers/contact.js');
const { verifyJWT } = require('../middlewares/auth.js');
const { isAdmin } = require('../middlewares/isAdmin.js');

router.post('/submit', addContactQuery);  
router.get('/pending', verifyJWT, isAdmin, getPendingContactQueries);  
router.get('/all', verifyJWT, isAdmin, getAllContactQueries);  
router.get('/:id', verifyJWT, isAdmin, getContactQueryById);  
router.put('/update-status/:id', verifyJWT, isAdmin, updateContactQueryStatus);  
router.delete('/delete/:id', verifyJWT, isAdmin, deleteContactQuery);
router.post('/response/:id',verifyJWT,isAdmin,respondToQuery);
module.exports ={router};
