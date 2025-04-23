const {executeQuery} = require('../db/db.js');
const {transporter} = require('../utils/mail.js');
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

async function respondToQuery(req, res) {
    const { id } = req.params;
    const { response } = req.body;
  
    try {
      const result = await executeQuery('SELECT name, email FROM contact_queries WHERE id = ?', [id]);
  
      if (result.length === 0) return res.status(404).json({ message: 'Query not found' });
  
      const { name, email } = result[0];
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'CarDekho - Response to Your Query',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #d32f2f; text-align: center;">CarDekho Support Response</h2>
            <p style="font-size: 16px; color: #333;">Hi ${name},</p>
  
            <p style="font-size: 16px; color: #333;">
              Thank you for reaching out to <strong style="color: #d32f2f;">CarDekho</strong>. Here's our response to your query:
            </p>
  
            <div style="background-color: #f1f1f1; padding: 15px; border-left: 5px solid #4caf50; margin: 20px 0; font-size: 16px; color: #333;">
              ${response}
            </div>
  
            <p style="font-size: 16px; color: #333;">We hope this helps! If you need further assistance, feel free to contact us again.</p>
            <p style="font-size: 16px; color: #333;">Warm regards,<br>🚗 CarDekho Support Team</p>
          </div>
        `
      });
      await executeQuery('UPDATE contact_queries SET response= ?, status=? WHERE id = ?', [response, "resolved",id]);
  
      res.status(200).json({ message: 'Response sent to user via email.' });
    } catch (error) {
      console.error('Respond Query Error:', error.message);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
  

module.exports = {
    addContactQuery,
    getAllContactQueries,
    getPendingContactQueries,
    updateContactQueryStatus,
    getContactQueryById,
    deleteContactQuery,
    respondToQuery
};
