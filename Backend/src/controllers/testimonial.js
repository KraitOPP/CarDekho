const executeQuery = require('../db/db.js');

async function addTestimonial(req, res) {
    try {
        const { content } = req.body;
        const user_id = req.user.id; 

        await executeQuery(`INSERT INTO testimonials (user_id, content, status) VALUES (?, ?, 'inactive')`, [user_id, content]);

        res.status(201).json({ message: "Testimonial submitted for approval." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getOwnTestimonials(req, res) {
    try {
        const user_id = req.user.id;

        const testimonials = await executeQuery(
            `SELECT id, content, status, created_at FROM testimonials WHERE user_id = ?`, 
            [user_id]
        );

        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getActiveTestimonials(req, res) {
    try {
        const testimonials = await executeQuery(`SELECT t.id, t.content, u.name FROM testimonials t JOIN users u ON t.user_id = u.id WHERE t.status='active'`);

        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getTestimonialById(req, res) {
    try {
        const { id } = req.params;

        const testimonial = await executeQuery(`SELECT t.id, t.content, t.status, u.name FROM testimonials t JOIN users u ON t.user_id = u.id WHERE t.id = ?`, [id]);

        if (testimonial.length === 0) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        res.status(200).json(testimonial[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateTestimonial(req, res) {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const user_id = req.user.id;

        const result = await executeQuery(`UPDATE testimonials SET content=?, status='inactive', updated_at=NOW() WHERE id=? AND user_id=?`, [content, id, user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Testimonial not found or unauthorized" });
        }

        res.status(200).json({ message: "Testimonial updated and sent for approval." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteTestimonial(req, res) {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const result = await executeQuery(`DELETE FROM testimonials WHERE id=? AND user_id=?`, [id, user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Testimonial not found or unauthorized" });
        }

        res.status(200).json({ message: "Testimonial deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAllTestimonials(req, res) {
    try {
        const testimonials = await executeQuery(`SELECT t.id, t.content, t.status, u.name FROM testimonials t JOIN users u ON t.user_id = u.id`);

        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function adminUpdateTestimonialStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const result = await executeQuery(`UPDATE testimonials SET status=? WHERE id=?`, [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        res.status(200).json({ message: `Testimonial status updated to '${status}' successfully.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function adminDeleteTestimonial(req, res) {
    try {
        const { id } = req.params;

        const result = await executeQuery(`DELETE FROM testimonials WHERE id=?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        res.status(200).json({ message: "Testimonial deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addTestimonial,
    getOwnTestimonials,
    getActiveTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial,
    getAllTestimonials,
    adminUpdateTestimonialStatus,
    adminDeleteTestimonial
};
