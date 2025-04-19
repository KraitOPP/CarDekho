const { executeQuery } = require('../db/db.js');

async function updateContactInfo(req, res) {
  const { company_name, main_email, support_email, main_phone, office_address, facebook_url, instagram_url, linkedin_url, working_days, updated_by } = req.body;
  try {

    const checkContactInfoQuery = 'SELECT id, company_name, main_email, support_email, main_phone, office_address, facebook_url, instagram_url, linkedin_url, working_days, updated_by FROM contact_info WHERE id = 1';
    const existingContactInfo = await executeQuery(checkContactInfoQuery);

    // Prepare working days as JSON
    const workingDaysJSON = JSON.stringify(working_days);

    if (existingContactInfo.length === 0) {
      const insertContactInfoQuery = `
        INSERT INTO contact_info (company_name, main_email, support_email, main_phone, office_address, facebook_url, instagram_url, linkedin_url, updated_by, working_days)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const insertResult = await executeQuery(insertContactInfoQuery, [
        company_name, 
        main_email, 
        support_email, 
        main_phone, 
        office_address, 
        facebook_url, 
        instagram_url, 
        linkedin_url, 
        updated_by,
        workingDaysJSON
      ]);

      const newContactInfo = await executeQuery(checkContactInfoQuery);
      
      return res.status(201).json({
        message: 'Contact info and working days inserted successfully!',
        contact_info: newContactInfo[0]
      });
    }

    const updateContactInfoQuery = `
      UPDATE contact_info SET 
        company_name = ?, 
        main_email = ?, 
        support_email = ?, 
        main_phone = ?, 
        office_address = ?, 
        facebook_url = ?, 
        instagram_url = ?, 
        linkedin_url = ?, 
        updated_by = ?, 
        working_days = ?
      WHERE id = 1;
    `;
    const updateContactResult = await executeQuery(updateContactInfoQuery, [
      company_name, 
      main_email, 
      support_email, 
      main_phone, 
      office_address, 
      facebook_url, 
      instagram_url, 
      linkedin_url, 
      updated_by,
      workingDaysJSON
    ]);

    if (updateContactResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Contact info not found.' });
    }

    const updatedContactInfo = await executeQuery(checkContactInfoQuery);

    res.status(200).json({
      message: 'Contact info and working days updated successfully!',
      contact_info: updatedContactInfo[0]
    });
  } catch (error) {
    console.error('Error updating or inserting contact info:', error.message);
    res.status(500).json({ message: 'Failed to update or insert contact info.', error: error.message });
  }
}


async function getContactInfo(req, res) {
  try {
    const query = `SELECT 
      id, company_name, main_email, support_email, main_phone,
      office_address, facebook_url, instagram_url, linkedin_url,
      updated_by, updated_at, working_days
    FROM contact_info
    WHERE id = 1`;

    const result = await executeQuery(query);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Contact info not found' });
    }

    const contactInfo = result[0];
   

    return res.status(200).json({ contact_info: contactInfo });
  } catch (error) {
    console.error('Error fetching contact info:', error.message);
    res.status(500).json({ message: 'Error fetching contact info', error: error.message });
  }
}



module.exports = {
  updateContactInfo,getContactInfo
};
