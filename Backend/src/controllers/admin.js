const { executeQuery } = require('../db/db.js');

async function getAdminStats(req, res){
  try {
    const [
      totalUsers,
      totalVehicles,
      totalBookings,
      totalTestimonials,
      availableVehicles,
      unavailableVehicles,
      monthlyRevenue
    ] = await Promise.all([
      executeQuery('SELECT COUNT(*) AS count FROM users'),
      executeQuery('SELECT COUNT(*) AS count FROM vehicles'),
      executeQuery('SELECT COUNT(*) AS count FROM bookings'),
      executeQuery('SELECT COUNT(*) AS count FROM testimonials'),
      executeQuery("SELECT COUNT(*) AS count FROM vehicles WHERE availability_status = 'available'"),
      executeQuery("SELECT COUNT(*) AS count FROM vehicles WHERE availability_status != 'available'"),
      executeQuery(`
        SELECT 
          DATE_FORMAT(booking_date, '%Y-%m') AS month,
          SUM(total_amount) AS revenue
        FROM bookings
        WHERE booking_status = 'completed'
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
      `)
    ]);

    res.status(200).json({
      totalUsers: totalUsers[0].count,
      totalVehicles: totalVehicles[0].count,
      totalBookings: totalBookings[0].count,
      totalTestimonials: totalTestimonials[0].count,
      availableVehicles: availableVehicles[0].count,
      unavailableVehicles: unavailableVehicles[0].count,
      monthlyRevenue 
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error.message);
    res.status(500).json({ message: 'Failed to fetch admin statistics' });
  }
};

module.exports = {
  getAdminStats
};
