const { executeQuery } = require('../db/db.js');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../middlewares/cloudinary.js'); 

async function bookCar(req, res) {
  const user_id = req.user.id;
  
  const {
    model_id,
    booking_date,
    return_date,
    current_address,
    house_number,
    street,
    area,
    city,
    state,
    country,
    zip_code,
    license_number
  } = req.body;

  if (!user_id || !model_id || !booking_date || !return_date || !current_address) {
    return res.status(400).json({ error: 'Missing required booking fields.' });
  }

  try {
    const tableStructure = await executeQuery('DESCRIBE addresses');
    console.log("Addresses table structure:", tableStructure);
    
    const columnNames = tableStructure.map(col => col.Field);
    console.log("Available columns:", columnNames);
    
    const userRows = await executeQuery(
      'SELECT license_number, licence_image, aadhaar_image FROM users WHERE id = ?',
      [user_id]
    );

    if (!userRows.length) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const { license_number: existingLicenseNumber, licence_image, aadhaar_image } = userRows[0];
    let newLicenseNumber = license_number || existingLicenseNumber || null;
    let newLicenseImage = licence_image;
    let newAadharImage = aadhaar_image;

    if (req.files) {
      if (req.files.license_image && req.files.license_image[0]) {
        newLicenseImage = req.files.license_image[0].path || null;
      }
      
      if (req.files.aadhaar_image && req.files.aadhaar_image[0]) {
        newAadharImage = req.files.aadhaar_image[0].path || null;
      }
    }

    await executeQuery(
      'UPDATE users SET license_number = ?, licence_image = ?, aadhaar_image = ? WHERE id = ?',
      [newLicenseNumber, newLicenseImage, newAadharImage, user_id]
    );

    const addressRows = await executeQuery(
      'SELECT * FROM addresses WHERE user_id = ?',
      [user_id]
    );

    const fullAddress = `${house_number || ''} ${street || ''} ${area || ''}`.trim() || null;
    
    if (addressRows.length > 0) {
      let updateSQL = 'UPDATE addresses SET ';
      const updateParams = [];
      
      if (columnNames.includes('address')) {
        updateSQL += 'address = ?, ';
        updateParams.push(fullAddress);
      }
      
      if (columnNames.includes('city')) {
        updateSQL += 'city = ?, ';
        updateParams.push(city || null);
      }
      
      if (columnNames.includes('state')) {
        updateSQL += 'state = ?, ';
        updateParams.push(state || null);
      }
      
      if (columnNames.includes('country')) {
        updateSQL += 'country = ?, ';
        updateParams.push(country || null);
      }
      
      if (columnNames.includes('zip_code')) {
        updateSQL += 'zip_code = ?, ';
        updateParams.push(zip_code || null);
      } else if (columnNames.includes('zip')) {
        updateSQL += 'zip = ?, ';
        updateParams.push(zip_code || null);
      } else if (columnNames.includes('postal_code')) {
        updateSQL += 'postal_code = ?, ';
        updateParams.push(zip_code || null);
      }
      
      updateSQL = updateSQL.slice(0, -2);
      
      updateSQL += ' WHERE user_id = ?';
      updateParams.push(user_id);
      
      if (updateParams.length > 1) { 
        await executeQuery(updateSQL, updateParams);
      }
    } else {
      let insertSQL = 'INSERT INTO addresses (user_id';
      let valuePlaceholders = '(?';
      const insertParams = [user_id];
      
      if (columnNames.includes('address')) {
        insertSQL += ', address';
        valuePlaceholders += ', ?';
        insertParams.push(fullAddress);
      }
      
      if (columnNames.includes('city')) {
        insertSQL += ', city';
        valuePlaceholders += ', ?';
        insertParams.push(city || null);
      }
      
      if (columnNames.includes('state')) {
        insertSQL += ', state';
        valuePlaceholders += ', ?';
        insertParams.push(state || null);
      }
      
      if (columnNames.includes('country')) {
        insertSQL += ', country';
        valuePlaceholders += ', ?';
        insertParams.push(country || null);
      }
      
      if (columnNames.includes('zip_code')) {
        insertSQL += ', zip_code';
        valuePlaceholders += ', ?';
        insertParams.push(zip_code || null);
      } else if (columnNames.includes('zip')) {
        insertSQL += ', zip';
        valuePlaceholders += ', ?';
        insertParams.push(zip_code || null);
      } else if (columnNames.includes('postal_code')) {
        insertSQL += ', postal_code';
        valuePlaceholders += ', ?';
        insertParams.push(zip_code || null);
      }
      
      insertSQL += ') VALUES ' + valuePlaceholders + ')';
      
      await executeQuery(insertSQL, insertParams);
    }
    
    const resultSets = await executeQuery(
      'CALL CreateBookingWithModel(?, ?, ?, ?, ?)',
      [user_id, model_id, booking_date, return_date, current_address]
    );

    const result = resultSets[0];

    res.status(201).json({
      message: 'Booking created successfully.',
      booking: result
    });
  } catch (err) {
    console.error('Booking Error:', err.message);
    res.status(500).json({ error: err.sqlMessage || 'Internal server error' });
  }
}
async function viewBookingHistory(req, res) {
  const user_id = req.user.id;

  try {
      const bookings = await executeQuery(`
          SELECT 
              b.id AS booking_id,
              b.rating,
              b.review,
              b.booking_date,
              b.return_date,
              b.booking_status,
              b.total_amount,
              b.payment_status,
              b.created_at,

              v.id AS vehicle_id,
              v.plate_number,
              v.color,
              v.availability_status,

              vm.id AS model_id,
              vm.model_name,

              vb.id AS brand_id,
              vb.brand_name

          FROM bookings b
          LEFT JOIN vehicles v ON b.vehicle_id = v.id
          LEFT JOIN vehicle_models vm ON b.vehicle_model_id = vm.id
          LEFT JOIN vehicle_brands vb ON vm.brand_id = vb.id
          WHERE b.user_id = ?
          ORDER BY b.created_at DESC;
      `, [user_id]);

      if (bookings.length === 0) {
          return res.status(404).json({ message: 'No booking history found.' });
      }

      // Collect all vehicle_ids and model_ids
      const vehicleIds = bookings.map(b => b.vehicle_id);
      const modelIds = bookings.map(b => b.model_id);

      // Fetch images in bulk
      const [vehicleImages, modelImages] = await Promise.all([
          executeQuery(`SELECT vehicle_id, image_path FROM vehicle_images WHERE vehicle_id IN (?)`, [vehicleIds]),
          executeQuery(`SELECT model_id, image_path FROM vehicle_model_images WHERE model_id IN (?)`, [modelIds])
      ]);

      // Create maps for fast lookup
      const vehicleImageMap = {};
      vehicleImages.forEach(img => {
          if (!vehicleImageMap[img.vehicle_id]) vehicleImageMap[img.vehicle_id] = [];
          vehicleImageMap[img.vehicle_id].push(img.image_path);
      });

      const modelImageMap = {};
      modelImages.forEach(img => {
          if (!modelImageMap[img.model_id]) modelImageMap[img.model_id] = [];
          modelImageMap[img.model_id].push(img.image_path);
      });

      // Append images to bookings
      const enrichedBookings = bookings.map(b => ({
          ...b,
          vehicle_images: vehicleImageMap[b.vehicle_id] || [],
          model_images: modelImageMap[b.model_id] || []
      }));

      res.status(200).json({ bookings: enrichedBookings });
  } catch (err) {
      console.error('Error fetching booking history:', err.message);
      res.status(500).json({ error: err.sqlMessage || 'Internal server error' });
  }
}



  async function cancelBooking(req, res) {
    const user_id = req.user.id;
    const booking_id = req.params.id; 
    if (!booking_id) {
      return res.status(400).json({ error: 'Booking ID is required.' });
    }
  
    try {
      const bookingRows = await executeQuery(
        'SELECT id, user_id, vehicle_id, booking_status FROM bookings WHERE id = ? AND user_id = ?',
        [booking_id, user_id]
      );
  
      if (bookingRows.length === 0) {
        return res.status(404).json({ error: 'Booking not found.' });
      }
  
      const booking = bookingRows[0];
      if (booking.booking_status === 'cancelled') {
        return res.status(400).json({ error: 'Booking has already been cancelled.' });
      }
      await executeQuery(
        'UPDATE bookings SET booking_status = "cancelled" WHERE id = ?',
        [booking_id]
      );
      await executeQuery(
        'UPDATE vehicles SET availability_status = "available" WHERE id = ?',
        [booking.vehicle_id]
      );
  
      res.status(200).json({ message: 'Booking cancelled successfully, and vehicle status updated to available.' });
  
    } catch (err) {
      console.error('Cancel Booking Error:', err.message);
      res.status(500).json({ error: err.sqlMessage || 'Internal server error' });
    }
  }


  async function viewAllBookings(req, res) {
    try {
        const bookings = await executeQuery(
            `SELECT 
                b.id AS booking_id,
                b.booking_date,
                b.return_date,
                b.booking_status,
                b.total_amount,
                b.current_address,
                b.payment_status,
                b.rating,
                b.review,
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                u.phone_number AS user_phone_number,
                u.license_number AS user_license_number,
                u.licence_image AS user_licence_image,
                u.aadhaar_image AS user_aadhaar_image,
                u.role AS user_role,
                a.house_no,
                a.street,
                a.area,
                a.city,
                a.state,
                a.zip_code,
                a.country,
                v.id AS vehicle_id,
                v.registration_no,
                v.plate_number,
                v.color AS vehicle_color,
                v.availability_status AS vehicle_availability_status,
                -- Separate image lists for vehicle and vehicle model
                GROUP_CONCAT(DISTINCT vi.image_path) AS vehicle_images,
                GROUP_CONCAT(DISTINCT vmi.image_path) AS vehicle_model_images,
                vm.id AS vehicle_model_id,
                vm.model_name AS vehicle_model_name,
                vm.category AS vehicle_model_category,
                vm.price_per_day AS vehicle_model_price_per_day,
                vb.id AS vehicle_brand_id,
                vb.brand_name AS vehicle_brand_name,
                vb.brand_logo AS vehicle_brand_logo
            FROM 
                bookings b
            JOIN users u ON b.user_id = u.id
            LEFT JOIN addresses a ON u.id = a.user_id
            JOIN vehicles v ON b.vehicle_id = v.id
            JOIN vehicle_models vm ON v.model_id = vm.id
            JOIN vehicle_brands vb ON vm.brand_id = vb.id
            LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id
            LEFT JOIN vehicle_model_images vmi ON vm.id = vmi.model_id
            GROUP BY 
                b.id, a.house_no, a.street, a.area, a.city, a.state, a.zip_code, a.country, 
                v.id, v.registration_no, v.plate_number, v.color, v.availability_status, 
                vm.id, vm.model_name, vm.category, vm.price_per_day, 
                vb.id, vb.brand_name, vb.brand_logo`
        );

        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found.' });
        }

        res.status(200).json({
            message: 'All bookings retrieved successfully.',
            bookings
        });
    } catch (err) {
        console.error('Error retrieving all bookings:', err.message);
        res.status(500).json({ error: err.sqlMessage || 'Internal server error' });
    }
}

async function updateBookingStatus(req, res) {
  const booking_id = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Booking status is required.' });
  }

  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid booking status provided.' });
  }

  try {
    const booking = await executeQuery(
      'SELECT * FROM bookings WHERE id = ?',
      [booking_id]
    );

    if (!booking.length) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    await executeQuery(
      'UPDATE bookings SET booking_status = ? WHERE id = ?',
      [status, booking_id]
    );

    // If booking is cancelled or completed, mark vehicle as available
    if (status === 'cancelled' || status === 'completed') {
      await executeQuery(
        'UPDATE vehicles SET availability_status = "available" WHERE id = ?',
        [booking[0].vehicle_id]
      );
    }

    res.status(200).json({
      message: `Booking status updated to ${status}.`,
      booking_id
    });
  } catch (err) {
    console.error('Error updating booking status:', err.message);
    res.status(500).json({ error: err.sqlMessage || 'Internal server error' });
  }
}

  async function updatePaymentStatus(req, res) {
    const booking_id = req.params.id;
    const { payment_status } = req.body;
  
    if (!payment_status) {
      return res.status(400).json({ error: 'Payment status is required.' });
    }
  
    try {
      const booking = await executeQuery(
        'SELECT * FROM bookings WHERE id = ?',
        [booking_id]
      );
  
      if (!booking.length) {
        return res.status(404).json({ error: 'Booking not found.' });
      }
  
      await executeQuery(
        'UPDATE bookings SET payment_status = ? WHERE id = ?',
        [payment_status, booking_id]
      );
  
      res.status(200).json({
        message: `Payment status updated to ${payment_status}.`,
        booking_id
      });
    } catch (err) {
      console.error('Error updating payment status:', err.message);
      res.status(500).json({ error: err.sqlMessage || 'Internal server error' });
    }
  }
  
  async function getBookingInfoById(req, res) {
    const booking_id = req.params.id;

    try {
        const bookings = await executeQuery(
            `SELECT 
                b.id, 
                b.booking_date,
                b.return_date,
                b.booking_status,
                b.payment_status,
                b.total_amount,
                b.current_address,
                b.rating,
                b.review,
                v.registration_no,
                v.plate_number,
                v.color,
                vm.model_name AS vehicle_model,
                vb.brand_name AS vehicle_brand,
                u.name AS user_name,
                u.email,
                u.phone_number,
                u.license_number,
                u.licence_image,
                u.aadhaar_image,
                GROUP_CONCAT(DISTINCT vi.image_path) AS vehicle_images,
                GROUP_CONCAT(DISTINCT vmi.image_path) AS vehicle_model_images
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            JOIN vehicle_models vm ON v.model_id = vm.id
            JOIN vehicle_brands vb ON vm.brand_id = vb.id
            JOIN users u ON b.user_id = u.id
            LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id
            LEFT JOIN vehicle_model_images vmi ON vm.id = vmi.model_id
            WHERE b.id = ?
            GROUP BY b.id`,
            [booking_id]
        );

        if (!bookings.length) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        res.status(200).json({ booking: bookings[0] });
    } catch (err) {
        console.error('Error fetching booking info:', err.message);
        res.status(500).json({ error: err.sqlMessage || 'Internal server error' });
    }
}


  async function rateBooking(req, res) {
    const user_id = req.user.id;
    const booking_id = req.params.id;
    const { rating, review } = req.body;
  
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
  
    try {
      const bookingRows = await executeQuery(
        'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
        [booking_id, user_id]
      );
  
      if (!bookingRows.length) {
        return res.status(404).json({ error: 'Booking not found.' });
      }
  
      if (bookingRows[0].rating) {
        return res.status(400).json({ error: 'Booking already rated.' });
      }
  
      await executeQuery(
        'UPDATE bookings SET rating = ?, review = ? WHERE id = ?',
        [rating, review || '', booking_id]
      );
  
      res.status(200).json({ message: 'Thank you for your feedback!' });
    } catch (err) {
      console.error('Rating Error:', err.message);
      res.status(500).json({ error: err.sqlMessage || 'Internal server error' });
    }
  }
  
  
module.exports = { bookCar,viewBookingHistory,cancelBooking,viewAllBookings,updateBookingStatus,updatePaymentStatus,getBookingInfoById,rateBooking};
