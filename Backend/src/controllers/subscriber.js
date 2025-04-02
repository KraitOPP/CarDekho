const { executeQuery } = require('../db/db.js');

async function getAllSubscribers(req, res) {
    try {
        const result = await executeQuery('SELECT * FROM subscribers');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addSubscriber(req, res) {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        await executeQuery('INSERT INTO subscribers (email, name) VALUES (?, ?)', [email, name]);
        res.json({ message: 'Subscriber added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteSubscriber(req, res) {
    const { id } = req.params;
    try {
        await executeQuery('DELETE FROM subscribers WHERE id = ?', [id]);
        res.json({ message: 'Subscriber deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateSubscriberStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    try {
        await executeQuery('UPDATE subscribers SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Subscriber status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllSubscribers,
    addSubscriber,
    deleteSubscriber,
    updateSubscriberStatus
};
