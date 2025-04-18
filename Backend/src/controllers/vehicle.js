const { executeQuery,pool } = require('../db/db.js');
const { uploadOnCloudinary, deleteFromCloudinary ,} = require('../middlewares/cloudinary.js');

// Add a new vehicle
async function addVehicle(req, res) {
    try {
        const {
            model_id,
            registration_no,
            plate_number,
            color,
            availability_status,
            current_mileage,
            purchase_date,
            insurance_provider,
            insurance_policy_number,
            insurance_expiry_date,
            insurance_detail 
        } = req.body;
        const images = req.files;

       
        const vehicleQuery = `
            INSERT INTO vehicles 
            (model_id, registration_no, plate_number, color, availability_status, current_mileage, purchase_date, insurance_provider, insurance_policy_number, insurance_expiry_date, insurance_detail)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await executeQuery(vehicleQuery, [
            model_id,
            registration_no,
            plate_number,
            color,
            availability_status,
            current_mileage,
            purchase_date,
            insurance_provider,
            insurance_policy_number,
            insurance_expiry_date,
            insurance_detail
        ]);

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
        const {
            model_id,
            registration_no,
            plate_number,
            color,
            availability_status,
            current_mileage,
            purchase_date,
            insurance_provider,
            insurance_policy_number,
            insurance_expiry_date,
            insurance_detail  
        } = req.body;
        const images = req.files;

        // Fetch the current vehicle data
        const currentVehicle = await executeQuery(`SELECT * FROM vehicles WHERE id=?`, [id]);
        if (currentVehicle.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Use coalesce-like logic to retain existing values if not provided
        const updatedModelId = model_id || currentVehicle[0].model_id;
        const updatedRegistrationNo = registration_no || currentVehicle[0].registration_no;
        const updatedPlateNumber = plate_number || currentVehicle[0].plate_number;
        const updatedColor = color || currentVehicle[0].color;
        const updatedAvailabilityStatus = availability_status || currentVehicle[0].availability_status;
        const updatedCurrentMileage = current_mileage || currentVehicle[0].current_mileage;
        const updatedPurchaseDate = purchase_date || currentVehicle[0].purchase_date;
        const updatedInsuranceProvider = insurance_provider || currentVehicle[0].insurance_provider;
        const updatedInsurancePolicyNumber = insurance_policy_number || currentVehicle[0].insurance_policy_number;
        const updatedInsuranceExpiryDate = insurance_expiry_date || currentVehicle[0].insurance_expiry_date;
        const updatedInsuranceDetail = insurance_detail || currentVehicle[0].insurance_detail;

        // Update vehicle data
        await executeQuery(
            `UPDATE vehicles SET model_id=?, registration_no=?, plate_number=?, color=?, availability_status=?, current_mileage=?, purchase_date=?, insurance_provider=?, insurance_policy_number=?, insurance_expiry_date=?, insurance_detail=?, updated_at=NOW() WHERE id=?`,
            [
                updatedModelId,
                updatedRegistrationNo,
                updatedPlateNumber,
                updatedColor,
                updatedAvailabilityStatus,
                updatedCurrentMileage,
                updatedPurchaseDate,
                updatedInsuranceProvider,
                updatedInsurancePolicyNumber,
                updatedInsuranceExpiryDate,
                updatedInsuranceDetail,
                id
            ]
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

async function deleteVehicle(req, res) {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(`CALL deleteVehicleAndReturnImagesOUT(?, @imagePaths); SELECT @imagePaths AS imagePaths`, [id]);

        const imagePathsString = rows[1][0].imagePaths;
        const imagePaths = imagePathsString ? imagePathsString.split(',').filter(Boolean) : [];

        for (const imagePath of imagePaths) {
            await deleteFromCloudinary(imagePath);
        }

        res.status(200).json({ message: 'Vehicle deleted successfully'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = { addVehicle, getAllVehicle, getVehicle, deleteVehicle, updateVehicle };
