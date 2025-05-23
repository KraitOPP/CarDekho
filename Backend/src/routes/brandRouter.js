const express = require('express');
const router = express.Router();
const {
  addBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require('../controllers/brand.js');

const { isAdmin } = require('../middlewares/isAdmin.js');
const { verifyJWT } = require('../middlewares/auth');
const {upload}=require('../middlewares/cloudinary.js')


// Public routes
router.get('/get-brands', getBrands);
router.get('/get-brand/:id', getBrandById);

// Admin-protected routes
router.post('/add-brand', verifyJWT, isAdmin,upload.fields([
  { name: 'brand_logo', maxCount: 1 }
]), addBrand);
router.put('/update-brand/:id', verifyJWT, isAdmin,
  upload.fields([
    { name: 'brand_logo', maxCount: 1 }
  ]), updateBrand);
router.put('/update-brand/:id', verifyJWT, isAdmin, updateBrand);
router.delete('/delete-brand/:id', verifyJWT, isAdmin, deleteBrand);


module.exports = { router };
