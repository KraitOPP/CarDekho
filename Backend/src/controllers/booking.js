const { executeQuery } = require('../db/db.js');
const { uploadOnCloudinary } = require('../middlewares/cloudinary.js');

async function bookCar(req, res) {
    try {
        const {
            vehicle_id,
            booking_date,
            return_date,
            permanent_address,
            temporary_address,
            license_number
        } = req.body;

        const user_id = req.user.id;

        const vehicle = await executeQuery(
            `SELECT * FROM vehicles WHERE id=? AND status='available'`,
            [vehicle_id]
        );
        if (vehicle.length === 0) {
            return res.status(400).json({ message: 'Vehicle not available for booking' });
        }

        const prevBookings = await executeQuery(
            `SELECT COUNT(*) as count FROM bookings WHERE user_id=?`,
            [user_id]
        );
        const isFirstBooking = prevBookings[0].count === 0;

        const user = await executeQuery(`SELECT * FROM users WHERE id=?`, [user_id]);
        const currentUser = user[0];

        const existingPerm = await executeQuery(
            `SELECT id FROM addresses WHERE user_id=? AND address_type='permanent'`,
            [user_id]
        );

        if (isFirstBooking) {
            const licenseImg = req.files?.license_image?.[0];
            const aadhaarImg = req.files?.aadhaar_image?.[0];

            if (
                !currentUser.license_number || !currentUser.license_image || !currentUser.aadhaar_image ||
                existingPerm.length === 0
            ) {
                if (!license_number || !licenseImg || !aadhaarImg) {
                    return res.status(400).json({ message: 'License number, license image, and Aadhaar image are required.' });
                }

                if (!permanent_address) {
                    return res.status(400).json({ message: 'Permanent address is required.' });
                }

                const { house_no, street, area, city, state, zip_code, country } = permanent_address;
                if (!house_no || !street || !area || !city || !state || !zip_code) {
                    return res.status(400).json({ message: 'All fields in permanent address are required.' });
                }

                const licenseImageUrl = await uploadOnCloudinary(licenseImg.path);
                const aadhaarImageUrl = await uploadOnCloudinary(aadhaarImg.path);


                await executeQuery(
                    `UPDATE users SET license_number=?, license_image=?, aadhaar_image=? WHERE id=?`,
                    [license_number, licenseImageUrl, aadhaarImageUrl, user_id]
                );

                await executeQuery(
                    `INSERT INTO addresses (user_id, address_type, house_no, street, area, city, state, zip_code, country)
                     VALUES (?, 'permanent', ?, ?, ?, ?, ?, ?, ?)`,
                    [user_id, house_no, street, area, city, state, zip_code, country || 'India']
                );
            }
        }

        const totalDays = Math.ceil((new Date(return_date) - new Date(booking_date)) / (1000 * 60 * 60 * 24));
        const totalAmount = totalDays * vehicle[0].price_per_day;

        const bookingResult = await executeQuery(
            `INSERT INTO bookings (user_id, vehicle_id, booking_date, return_date, booking_status, total_amount)
             VALUES (?, ?, ?, ?, 'pending', ?)`,
            [user_id, vehicle_id, booking_date, return_date, totalAmount]
        );
        const booking_id = bookingResult.insertId;

        if (temporary_address) {
            const { house_no, street, area, city, state, zip_code, country } = temporary_address;
            await executeQuery(
                `INSERT INTO addresses (user_id, booking_id, address_type, house_no, street, area, city, state, zip_code, country)
                 VALUES (?, ?, 'temporary', ?, ?, ?, ?, ?, ?, ?)`,
                [user_id, booking_id, house_no, street, area, city, state, zip_code, country || 'India']
            );
        }

        await executeQuery(`UPDATE vehicles SET status='booked' WHERE id=?`, [vehicle_id]);

        res.status(201).json({ message: 'Booking request submitted successfully' });
    } catch (error) {
        console.error('Error in bookCar:', error.message);
        res.status(500).json({ error: error.message });
    }
}


async function viewBookingHistory(req, res) {
    try {
        const user_id = req.user.id;
        const bookings = await executeQuery(`
            SELECT b.*, v.model AS vehicle_model,
                (SELECT JSON_OBJECT('house_no', a.house_no, 'street', a.street, 'area', a.area, 'city', a.city, 'state', a.state, 'zip_code', a.zip_code, 'country', a.country)
                 FROM addresses a
                 WHERE a.booking_id = b.id AND a.address_type = 'temporary'
                 LIMIT 1) AS temporary_address
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [user_id]);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function cancelBooking(req, res) {
    try {
        const booking_id = req.params.id;
        const user_id = req.user.id;

        const booking = await executeQuery(`SELECT * FROM bookings WHERE id=? AND user_id=?`, [booking_id, user_id]);
        if (booking.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await executeQuery(`UPDATE bookings SET booking_status='cancelled' WHERE id=?`, [booking_id]);
        await executeQuery(`UPDATE vehicles SET status='available' WHERE id=?`, [booking[0].vehicle_id]);

        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function viewAllBookings(req, res) {
    try {
        const bookings = await executeQuery(`
            SELECT b.*, u.name AS user_name, v.model AS vehicle_model,
                (SELECT JSON_OBJECT('house_no', a.house_no, 'street', a.street, 'area', a.area, 'city', a.city, 'state', a.state, 'zip_code', a.zip_code, 'country', a.country)
                 FROM addresses a
                 WHERE a.booking_id = b.id AND a.address_type = 'temporary'
                 LIMIT 1) AS temporary_address
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
            ORDER BY b.created_at DESC
        `);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function confirmBooking(req, res) {
    try {
        const booking_id = req.params.id;

        const booking = await executeQuery(`SELECT * FROM bookings WHERE id=?`, [booking_id]);
        if (booking.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await executeQuery(`UPDATE bookings SET booking_status='confirmed' WHERE id=?`, [booking_id]);

        res.status(200).json({ message: 'Booking confirmed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function adminCancelBooking(req, res) {
    try {
        const booking_id = req.params.id;

        const booking = await executeQuery(`SELECT * FROM bookings WHERE id=?`, [booking_id]);
        if (booking.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await executeQuery(`UPDATE bookings SET booking_status='cancelled' WHERE id=?`, [booking_id]);
        await executeQuery(`UPDATE vehicles SET status='available' WHERE id=?`, [booking[0].vehicle_id]);

        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    bookCar,
    viewBookingHistory,
    cancelBooking,
    viewAllBookings,
    confirmBooking,
    adminCancelBooking,
};
