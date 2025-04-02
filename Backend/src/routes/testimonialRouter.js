const express = require('express');
const router = express.Router();
const { addTestimonial, getTestimonialById,getOwnTestimonials, getActiveTestimonials, updateTestimonial, deleteTestimonial, getAllTestimonials, adminUpdateTestimonialStatus, adminDeleteTestimonial } = require('../controllers/testimonial.js');
const { verifyJWT } = require('../middlewares/auth.js');
const { isAdmin } = require('../middlewares/isAdmin.js');


router.post('/add-testimonial', verifyJWT, addTestimonial); 
router.get('/view-testimonial', verifyJWT,getTestimonialById); 
router.get('/my-testimonials', verifyJWT, getOwnTestimonials); 
router.get('/active-testimonials', getActiveTestimonials); 
router.put('/update-testimonial/:id', verifyJWT, updateTestimonial); 
router.delete('/delete-testimonial/:id', verifyJWT, deleteTestimonial);

// **ADMIN ROUTES**
router.get('/all-testimonials', verifyJWT, isAdmin, getAllTestimonials); 
router.put('/modify-status/:id', verifyJWT, isAdmin, adminUpdateTestimonialStatus); 
router.delete('/admin-delete-testimonial/:id', verifyJWT, isAdmin, adminDeleteTestimonial);

module.exports = {router};
