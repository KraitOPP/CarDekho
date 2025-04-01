

const { executeQuery, pool } = require('../db/db.js');

async function addBrand(req,res) {
  try {
    const { brand_name } = req.body;
    if (!brand_name) {
      return res.status(400).json({ error: 'Brand name is required' });
    }

    const result = await executeQuery(
      `INSERT INTO vehicle_brands (brand_name) VALUES (?)`,
      [brand_name]
    );
    
    return res.status(201).json({ message: 'Brand created successfully', brand_id: result.insertId });
  } catch (error) {
    console.error('Error adding brand:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function getBrands(req,res)  {
  try {
    const brands = await executeQuery(`SELECT * FROM vehicle_brands`);
    return res.status(200).json({ brands });
  } catch (error) {
    console.error('Error retrieving brands:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


async function getBrandById(req,res)  {
  try {
    const brandId = req.params.id;
    const rows = await executeQuery(
      `SELECT * FROM vehicle_brands WHERE id = ?`,
      [brandId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    return res.status(200).json({ brand: rows[0] });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


async function updateBrand(req,res)  {
  try {
    const brandId = req.params.id;
    const { brand_name } = req.body;
    
    if (!brand_name) {
      return res.status(400).json({ error: 'Brand name is required' });
    }
    
    const result = await executeQuery(
      `UPDATE vehicle_brands SET brand_name = ? WHERE id = ?`,
      [brand_name, brandId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    
    return res.status(200).json({ message: 'Brand updated successfully' });
  } catch (error) {
    console.error('Error updating brand:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


async function deleteBrand(req,res)  {
  const brandId = req.params.id;
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    await connection.query(
      `DELETE FROM vehicles WHERE brand_id = ?`,
      [brandId]
    );
    

    const [brandResult] = await connection.query(
      `DELETE FROM vehicle_brands WHERE id = ?`,
      [brandId]
    );
    
    if (brandResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Brand not found or already deleted' });
    }
    
    await connection.commit();
    return res.status(200).json({ message: 'Brand and associated vehicles deleted successfully' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error deleting brand and associated vehicles:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  addBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
