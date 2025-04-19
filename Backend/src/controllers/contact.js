const {executeQuery} = require('../db/db.js');

async function addContactQuery(req, res) {
    try {
        const { name, email, phone_number, subject, message } = req.body;
        await executeQuery(
            `INSERT INTO contact_queries (name, email, phone_number, subject, message, status) VALUES (?, ?, ?, ?, ?, 'pending')`,
            [name, email, phone_number, subject, message]
        );
        res.status(201).json({ message: "Your query has been submitted." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAllContactQueries(req, res) {
    try {
        const queries = await executeQuery(`SELECT * FROM contact_queries ORDER BY created_at DESC`);
        res.status(200).json(queries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getPendingContactQueries(req, res) {
    try {
        const pendingQueries = await executeQuery(`SELECT * FROM contact_queries WHERE status = 'pending' ORDER BY created_at DESC`);
        res.status(200).json(pendingQueries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getContactQueryById(req, res) {
    try {
        const { id } = req.params;
        const query = await executeQuery(`SELECT * FROM contact_queries WHERE id = ?`, [id]);
        
        if (query.length === 0) {
            return res.status(404).json({ message: "Query not found" });
        }
        
        res.status(200).json(query[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function updateContactQueryStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        

        const result = await executeQuery(
            `UPDATE contact_queries SET status = ? WHERE id = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Query not found" });
        }

        res.status(200).json({ message: `Query status updated to '${status}'.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



async function deleteContactQuery(req, res) {
    try {
        const { id } = req.params;
        
        const result = await executeQuery(`DELETE FROM contact_queries WHERE id=?`, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Query not found" });
        }
        
        res.status(200).json({ message: "Query deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addContactQuery,
    getAllContactQueries,
    getPendingContactQueries,
    updateContactQueryStatus,
    getContactQueryById,
    deleteContactQuery
};
