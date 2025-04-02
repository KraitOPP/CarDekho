const executeQuery = require('../db/db.js');


async function bookCar(req, res) {
    try {
        const { vehicle_id, booking_date, return_date } = req.body;
        const user_id = req.user.id;

        const vehicle = await executeQuery(`SELECT * FROM vehicles WHERE id=? AND status='available'`, [vehicle_id]);
        if (vehicle.length === 0) {
            return res.status(400).json({ message: 'Vehicle not available for booking' });
        }

        const totalDays = Math.ceil((new Date(return_date) - new Date(booking_date)) / (1000 * 60 * 60 * 24));
        const totalAmount = totalDays * vehicle[0].price_per_day;

        await executeQuery(
            `INSERT INTO bookings (user_id, vehicle_id, booking_date, return_date, booking_status, total_amount) VALUES (?, ?, ?, ?, 'pending', ?)`,
            [user_id, vehicle_id, booking_date, return_date, totalAmount]
        );

        await executeQuery(`UPDATE vehicles SET status='booked' WHERE id=?`, [vehicle_id]);

        res.status(201).json({ message: 'Booking request submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function viewBookingHistory(req, res) {
    try {
        const user_id = req.user.id;
        const bookings = await executeQuery(`SELECT * FROM bookings WHERE user_id=? ORDER BY created_at DESC`, [user_id]);
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
            SELECT b.*, u.name AS user_name, v.model AS vehicle_model 
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
        const admin_id = req.user.id; 

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
        const booking_id = req.params;

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
