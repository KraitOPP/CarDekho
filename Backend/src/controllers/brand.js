const { executeQuery, pool } = require('../db/db.js');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../middlewares/cloudinary.js');

// Add a new brand with optional logo
async function addBrand(req, res) {
  try {
    const { brand_name } = req.body;
    const logoFile = req.files?.brand_logo?.[0];

    if (!brand_name) {
      return res.status(400).json({ error: 'Brand name is required' });
    }

    let logoUrl = null;
    if (logoFile) {
      logoUrl = await uploadOnCloudinary(logoFile.path);
    }

    const result = await executeQuery(
      `INSERT INTO vehicle_brands (brand_name, brand_logo) VALUES (?, ?)`,
      [brand_name, logoUrl]
    );

    return res.status(201).json({
      message: 'Brand created successfully',
      brand_id: result.insertId,
    });
  } catch (error) {
    console.error('Error adding brand:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get all brands
async function getBrands(req, res) {
  try {
    const brands = await executeQuery(`SELECT * FROM vehicle_brands`);
    return res.status(200).json({ brands });
  } catch (error) {
    console.error('Error retrieving brands:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get brand by ID
async function getBrandById(req, res) {
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
}

// Update brand name and/or logo
async function updateBrand(req, res) {
  try {
    const brandId = req.params.id;
    const { brand_name } = req.body;
    const logoFile = req.files?.brand_logo?.[0];

    if (!brand_name && !logoFile) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    const existing = await executeQuery(`SELECT * FROM vehicle_brands WHERE id = ?`, [brandId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    let logoUrl = existing[0].brand_logo;

    if (logoFile) {
      if (logoUrl) await deleteFromCloudinary(logoUrl);
      logoUrl = await uploadOnCloudinary(logoFile.path);
    }

    const result = await executeQuery(
      `UPDATE vehicle_brands SET brand_name = ?, brand_logo = ? WHERE id = ?`,
      [brand_name || existing[0].brand_name, logoUrl, brandId]
    );

    return res.status(200).json({ message: 'Brand updated successfully' });
  } catch (error) {
    console.error('Error updating brand:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Delete brand and associated vehicles
async function deleteBrand(req, res) {
  const brandId = req.params.id;
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const brandRows = await connection.query(
      `SELECT brand_logo FROM vehicle_brands WHERE id = ?`,
      [brandId]
    );
    const brandLogo = brandRows[0][0]?.brand_logo;

    const [modelRows] = await connection.query(
      `SELECT id FROM vehicle_models WHERE brand_id = ?`,
      [brandId]
    );
    const modelIds = modelRows.map(row => row.id);

    if (modelIds.length > 0) {
      const [vehicleRows] = await connection.query(
        `SELECT id FROM vehicles WHERE model_id IN (?)`,
        [modelIds]
      );
      const vehicleIds = vehicleRows.map(row => row.id);

      if (vehicleIds.length > 0) {
        await connection.query(
          `DELETE FROM vehicle_images WHERE vehicle_id IN (?)`,
          [vehicleIds]
        );

        await connection.query(
          `DELETE FROM vehicles WHERE id IN (?)`,
          [vehicleIds]
        );
      }

      await connection.query(
        `DELETE FROM vehicle_model_images WHERE model_id IN (?)`,
        [modelIds]
      );

      await connection.query(
        `DELETE FROM vehicle_models WHERE id IN (?)`,
        [modelIds]
      );
    }

    // Delete the brand itself
    const [brandResult] = await connection.query(
      `DELETE FROM vehicle_brands WHERE id = ?`,
      [brandId]
    );

    if (brandResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Brand not found or already deleted' });
    }

    // Delete the brand logo from Cloudinary if it exists
    if (brandLogo) await deleteFromCloudinary(brandLogo);

    await connection.commit();
    return res.status(200).json({ message: 'Brand, models, vehicles, and related images deleted successfully' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error deleting brand:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  addBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
