const { executeQuery } = require('../db/db.js');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../middlewares/cloudinary.js');

// Add a new vehicle
async function addVehicle(req, res) {
    try {
        const { brand_id, model, registration_no, type, price_per_day, description, status } = req.body;
        const images = req.files;

        // Insert vehicle details into database
        const vehicleQuery = `INSERT INTO vehicles (brand_id, model, registration_no, type, price_per_day, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const result = await executeQuery(vehicleQuery, [brand_id, model, registration_no, type, price_per_day, description, status]);

        const vehicle_id = result.insertId;

        if (images && images.length > 0) {
            for (const file of images) {
                const cloudinaryUrl = await uploadOnCloudinary(file.path);
                if (cloudinaryUrl) {
                    await executeQuery(`INSERT INTO vehicle_images (vehicle_id, image_path) VALUES (?, ?)`, [vehicle_id, cloudinaryUrl]);
                }
            }
        }

        res.status(201).json({ message: 'Vehicle added successfully', vehicle_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get a vehicle by ID
async function getVehicle(req, res) {
    try {
        const { id } = req.params;

        const vehicle = await executeQuery(`SELECT * FROM vehicles WHERE id=?`, [id]);
        if (vehicle.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const images = await executeQuery(`SELECT image_path FROM vehicle_images WHERE vehicle_id=?`, [id]);

        res.status(200).json({
            vehicle: vehicle[0],
            images: images.map(img => img.image_path),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get all vehicles
async function getAllVehicle(req, res) {
    try {
        const vehicles = await executeQuery(`SELECT * FROM vehicles`);
        const images = await executeQuery(`SELECT vehicle_id, image_path FROM vehicle_images`);

        const vehicleMap = vehicles.map(vehicle => ({
            ...vehicle,
            images: images.filter(img => img.vehicle_id === vehicle.id).map(img => img.image_path),
        }));

        res.status(200).json(vehicleMap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a vehicle
async function updateVehicle(req, res) {
    try {
        const { id } = req.params;
        const { brand_id, model, registration_no, type, price_per_day, description, status } = req.body;
        const images = req.files;

        // Fetch the current vehicle data to check existing values
        const currentVehicle = await executeQuery(`SELECT * FROM vehicles WHERE id=?`, [id]);
        if (currentVehicle.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Use coalesce-like logic to keep the existing value if a field is not provided
        const updatedBrandId = brand_id || currentVehicle[0].brand_id;
        const updatedModel = model || currentVehicle[0].model;
        const updatedRegistrationNo = registration_no || currentVehicle[0].registration_no;
        const updatedType = type || currentVehicle[0].type;
        const updatedPricePerDay = price_per_day || currentVehicle[0].price_per_day;
        const updatedDescription = description || currentVehicle[0].description;
        const updatedStatus = status || currentVehicle[0].status;

        // Update query using the coalesced values
        await executeQuery(
            `UPDATE vehicles SET brand_id=?, model=?, registration_no=?, type=?, price_per_day=?, description=?, status=?, updated_at=NOW() WHERE id=?`,
            [updatedBrandId, updatedModel, updatedRegistrationNo, updatedType, updatedPricePerDay, updatedDescription, updatedStatus, id]
        );

        // Handle image uploads and removals
        if (images && images.length > 0) {
            const oldImages = await executeQuery(`SELECT image_path FROM vehicle_images WHERE vehicle_id=?`, [id]);
            for (const oldImage of oldImages) {
                await deleteFromCloudinary(oldImage.image_path);
            }

            await executeQuery(`DELETE FROM vehicle_images WHERE vehicle_id=?`, [id]);

            for (const image of images) {
                const cloudinaryUrl = await uploadOnCloudinary(image.path);
                if (cloudinaryUrl) {
                    await executeQuery(`INSERT INTO vehicle_images (vehicle_id, image_path) VALUES (?, ?)`, [id, cloudinaryUrl]);
                }
            }
        }

        res.status(200).json({ message: 'Vehicle updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete a vehicle
async function deleteVehicle(req, res) {
    try {
        const { id } = req.params;

        const images = await executeQuery(`SELECT image_path FROM vehicle_images WHERE vehicle_id=?`, [id]);

        for (const image of images) {
            await deleteFromCloudinary(image.image_path);
        }

        await executeQuery(`DELETE FROM vehicle_images WHERE vehicle_id=?`, [id]);
        await executeQuery(`DELETE FROM vehicles WHERE id=?`, [id]);

        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { addVehicle, getAllVehicle, getVehicle, deleteVehicle, updateVehicle };
