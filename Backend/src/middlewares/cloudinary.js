const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'CarDekho',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    }
});

const upload = multer({ storage });

// Function to upload an image to Cloudinary
const uploadOnCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'CarDekho'
        });
        return result.secure_url; // Returns the URL of the uploaded image
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return null;
    }
};

// Function to delete an image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted ${publicId} from Cloudinary`);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
};

module.exports = { upload, storage, uploadOnCloudinary, deleteFromCloudinary };
