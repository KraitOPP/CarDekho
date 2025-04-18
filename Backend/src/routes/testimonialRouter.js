const express = require('express');
const router = express.Router();
const { addTestimonial,getActiveTestimonials,getAllTestimonials,adminUpdateTestimonialStatus,adminDeleteTestimonial } = require('../controllers/testimonial.js');
const { verifyJWT } = require('../middlewares/auth.js');
const { isAdmin } = require('../middlewares/isAdmin.js');


router.post('/add-testimonial', verifyJWT, addTestimonial); 
router.get('/active-testimonials', getActiveTestimonials); 

// **ADMIN ROUTES**
router.get('/all-testimonials', verifyJWT, isAdmin, getAllTestimonials); 
router.put('/modify-status/:id', verifyJWT, isAdmin, adminUpdateTestimonialStatus); 
router.delete('/admin-delete-testimonial/:id', verifyJWT, isAdmin, adminDeleteTestimonial);

module.exports = {router};
