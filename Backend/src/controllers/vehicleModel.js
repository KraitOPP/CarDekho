const { executeQuery } = require('../db/db.js');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../middlewares/cloudinary.js');


async function addVehicleModel(req, res) {
    try {
        const {
            brand_id,
            model_name,
            category,
            price_per_day,
            fuel_type,
            transmission,
            number_of_doors,
            number_of_seats,
            description,
            features
        } = req.body;
        console.log(brand_id,
            model_name,
            category,
            price_per_day,
            fuel_type,
            transmission,
            number_of_doors,
            number_of_seats,
            description,
            features);
        const images = req.files;

        const query = `
            INSERT INTO vehicle_models 
            (brand_id, model_name, category, price_per_day, fuel_type, transmission, number_of_doors, number_of_seats, description, features) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await executeQuery(query, [
            brand_id,
            model_name,
            category,
            price_per_day,
            fuel_type,
            transmission,
            number_of_doors,
            number_of_seats,
            description,
            features
        ]);

        const modelId = result.insertId;

        if (images && images.length > 0) {
            for (const image of images) {
                const url = await uploadOnCloudinary(image.path);
                if (url) {
                    await executeQuery(`INSERT INTO vehicle_model_images (model_id, image_path) VALUES (?, ?)`, [modelId, url]);
                }
            }
        }

        res.status(201).json({ message: 'Model added successfully', model_id: modelId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get a vehicle model by ID
async function getVehicleModel(req, res) {
    try {
        const { id } = req.params;

        const model = await executeQuery(`SELECT * FROM vehicle_models WHERE id=?`, [id]);
        if (model.length === 0) {
            return res.status(404).json({ message: 'Model not found' });
        }

        const images = await executeQuery(
            `SELECT image_path FROM vehicle_model_images WHERE model_id=?`,
            [id]
        );

        const ratingResult = await executeQuery(
            `SELECT ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS total_reviews
             FROM bookings 
             WHERE vehicle_model_id = ? AND rating IS NOT NULL`,
            [id]
        );

        const vehicleCount = await executeQuery(
            `SELECT COUNT(*) AS available_vehicle_count 
             FROM vehicles 
             WHERE model_id = ? AND availability_status = 'available'`,
            [id]
        );

        const avg_rating = ratingResult[0].avg_rating || null;
        const total_reviews = ratingResult[0].total_reviews || 0;
        const available_vehicle_count = vehicleCount[0].available_vehicle_count || 0;
        let isAvailable=available_vehicle_count>0?true:false;
        res.status(200).json({
            model: model[0],
            images: images.map(img => img.image_path),
            avg_rating,
            total_reviews,
            available_vehicle_count,
            isAvailable
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Get all vehicle models
async function getAllVehicleModels(req, res) {
    try {
        const models = await executeQuery(`SELECT * FROM vehicle_models`);
        const images = await executeQuery(`SELECT model_id, image_path FROM vehicle_model_images`);

        const ratings = await executeQuery(`
            SELECT vehicle_model_id, ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS total_reviews
            FROM bookings 
            WHERE rating IS NOT NULL
            GROUP BY vehicle_model_id
        `);

        const availableVehicles = await executeQuery(`
            SELECT model_id, COUNT(*) AS available_vehicle_count
            FROM vehicles 
            WHERE availability_status = 'available'
            GROUP BY model_id
        `);

        const ratingsMap = {};
        ratings.forEach(r => {
            ratingsMap[r.vehicle_model_id] = {
                avg_rating: r.avg_rating,
                total_reviews: r.total_reviews
            };
        });

        const availabilityMap = {};
        availableVehicles.forEach(v => {
            availabilityMap[v.model_id] = v.available_vehicle_count;
        });

        const mappedModels = models.map(model => {
            const ratingInfo = ratingsMap[model.id] || { avg_rating: null, total_reviews: 0 };
            const availableCount = availabilityMap[model.id] || 0;
            const isAvailable=availabilityMap[model.id]?true:false;

            return {
                ...model,
                images: images.filter(img => img.model_id === model.id).map(img => img.image_path),
                avg_rating: ratingInfo.avg_rating,
                total_reviews: ratingInfo.total_reviews,
                available_vehicle_count: availableCount,
                isAvailable
            };
        });

        res.status(200).json(mappedModels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Update a vehicle model
async function updateVehicleModel(req, res) {
    try {
        const { id } = req.params;
        const {
            brand_id,
            model_name,
            category,
            price_per_day,
            fuel_type,
            transmission,
            number_of_doors,
            number_of_seats,
            description,
            features
        } = req.body;
        const images = req.files;

        const currentModel = await executeQuery(`SELECT * FROM vehicle_models WHERE id=?`, [id]);
        if (currentModel.length === 0) {
            return res.status(404).json({ message: 'Model not found' });
        }

        const model = currentModel[0];

        const updatedData = [
            brand_id || model.brand_id,
            model_name || model.model_name,
            category || model.category,
            price_per_day || model.price_per_day,
            fuel_type || model.fuel_type,
            transmission || model.transmission,
            number_of_doors || model.number_of_doors,
            number_of_seats || model.number_of_seats,
            description || model.description,
            features || model.features,
            id
        ];

        await executeQuery(`
            UPDATE vehicle_models SET
            brand_id=?, model_name=?, category=?, price_per_day=?, fuel_type=?, transmission=?,
            number_of_doors=?, number_of_seats=?, description=?, features=?, updated_at=NOW()
            WHERE id=?`, updatedData);

        if (images && images.length > 0) {
            const oldImages = await executeQuery(`SELECT image_path FROM vehicle_model_images WHERE model_id=?`, [id]);
            for (const image of oldImages) {
                await deleteFromCloudinary(image.image_path);
            }

            await executeQuery(`DELETE FROM vehicle_model_images WHERE model_id=?`, [id]);

            for (const image of images) {
                const url = await uploadOnCloudinary(image.path);
                if (url) {
                    await executeQuery(`INSERT INTO vehicle_model_images (model_id, image_path) VALUES (?, ?)`, [id, url]);
                }
            }
        }

        res.status(200).json({ message: 'Model updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteVehicleModel(req, res) {
    try {
        const { id } = req.params;

        // Get all Cloudinary image paths
        const modelImages = await executeQuery(
            `SELECT image_path FROM vehicle_model_images WHERE model_id=?`,
            [id]
        );

        for (const img of modelImages) {
            await deleteFromCloudinary(img.image_path); // This remains in Node.js
        }

        // Call the stored procedure to delete all related records
        await executeQuery(`CALL DeleteVehicleModelById(?)`, [id]);

        res.status(200).json({ message: 'Vehicle model and associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
    addVehicleModel,
    getVehicleModel,
    getAllVehicleModels,
    updateVehicleModel,
    deleteVehicleModel
};
