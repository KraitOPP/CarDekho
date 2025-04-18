const { executeQuery } = require('../db/db.js');

// Add Testimonial (User)
async function addTestimonial(req, res) {
    try {
        const { content, rating } = req.body;
        const user_id = req.user.id;
        console.log(content,rating,user_id)
        if (!content || !rating || !user_id) {
            return res.status(400).json({ message: "Content, rating, and user ID are required." });
        }

        await executeQuery(
            `INSERT INTO testimonials (user_id, content, rating, status) VALUES (?, ?, ?, 'inactive')`,
            [user_id, content, rating]
        );

        res.status(201).json({ message: "Testimonial submitted for approval." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function getActiveTestimonials(req, res) {
    try {
        const query = `
            SELECT t.id, t.content, t.rating, t.status, u.id AS user_id, u.name,u.email
            FROM testimonials t
            JOIN users u ON t.user_id = u.id
            WHERE t.status = 'active'
        `;

        const testimonials = await executeQuery(query);
        res.status(200).json({message:"Active testimonials",testimonials});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get All Testimonials (Admin)
async function getAllTestimonials(req, res) {
    try {
        const query = `
            SELECT t.id, t.content, t.rating, t.status, t.created_at, t.updated_at,
                   u.id AS user_id, u.name,u.email
            FROM testimonials t
            JOIN users u ON t.user_id = u.id
        `;

        const testimonials = await executeQuery(query);
        res.status(200).json({message:"Testimonials fetched successfully",testimonials});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Admin: Update Testimonial Status
async function adminUpdateTestimonialStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await executeQuery(
            `UPDATE testimonials SET status = ?, updated_at = NOW() WHERE id = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        res.status(200).json({ message: "Testimonial status updated successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Admin: Delete Testimonial
async function adminDeleteTestimonial(req, res) {
    try {
        const { id } = req.params;

        const result = await executeQuery(
            `DELETE FROM testimonials WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        res.status(200).json({ message: "Testimonial deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports={addTestimonial,getActiveTestimonials,getAllTestimonials,adminUpdateTestimonialStatus,adminDeleteTestimonial};