const express = require('express');
const router = express.Router();
const {bookCar,viewBookingHistory,cancelBooking,viewAllBookings,confirmBooking,adminCancelBooking,}=require('../controllers/booking.js')
const {verifyJWT}= require('../middlewares/auth.js');
const {isAdmin}=require('../middlewares/isAdmin.js')
const {upload}=require('../middlewares/cloudinary.js')


router.post(
    '/book',
    verifyJWT,
    upload.fields([
      { name: 'license_image', maxCount: 1 },
      { name: 'aadhaar_image', maxCount: 1 }
    ]),
    bookCar
  );
  
router.get('/book-history', verifyJWT,viewBookingHistory); 
router.put('/cancel/:id', verifyJWT, cancelBooking);

// **ADMIN ROUTES**
router.get('/view-bookings', verifyJWT,isAdmin,viewAllBookings); 
router.put('/confirm-booking/:id', verifyJWT,isAdmin,confirmBooking); 
router.put('/admin-cancel-booking/:id', verifyJWT, isAdmin,adminCancelBooking); 

module.exports = {router};
