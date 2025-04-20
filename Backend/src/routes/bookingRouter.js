const express = require('express');
const router = express.Router();

const {
  bookCar,
  viewBookingHistory,
  cancelBooking,
  viewAllBookings,
  updateBookingStatus,
  updatePaymentStatus,
  getBookingInfoById,
  rateBooking
} = require('../controllers/booking.js');

const { verifyJWT } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/isAdmin');
const {upload}=require('../middlewares/cloudinary.js')

// User Routes
router.post('/book', verifyJWT,upload.fields([
  { name: 'aadhaar_image', maxCount: 1 },
  { name: 'license_image', maxCount: 1 }
]), bookCar);
router.get('/history', verifyJWT, viewBookingHistory);
router.put('/cancel/:id', verifyJWT, cancelBooking);

// Admin Routes
router.get('/all', verifyJWT, isAdmin, viewAllBookings);
router.put('/status/:id', verifyJWT, isAdmin, updateBookingStatus);
router.put('/payment/:id', verifyJWT, isAdmin, updatePaymentStatus);
router.get('/info/:id', verifyJWT, isAdmin, getBookingInfoById);
router.post('/rate/:id', verifyJWT, rateBooking);

module.exports = {router};
