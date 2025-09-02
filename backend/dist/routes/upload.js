"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image and video files are allowed'));
        }
    }
});
router.post('/image', auth_1.authenticate, upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        const result = await new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload_stream({
                resource_type: 'image',
                folder: 'secondhand-marketplace/products',
                transformation: [
                    { width: 800, height: 600, crop: 'limit' },
                    { quality: 'auto' }
                ]
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            }).end(req.file.buffer);
        });
        res.json({
            success: true,
            message: 'Image uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/images', auth_1.authenticate, upload.array('images', 10), async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No image files provided' });
        }
        const files = req.files;
        const uploadPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                cloudinary_1.v2.uploader.upload_stream({
                    resource_type: 'image',
                    folder: 'secondhand-marketplace/products',
                    transformation: [
                        { width: 800, height: 600, crop: 'limit' },
                        { quality: 'auto' }
                    ]
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id
                        });
                }).end(file.buffer);
            });
        });
        const results = await Promise.all(uploadPromises);
        res.json({
            success: true,
            message: 'Images uploaded successfully',
            images: results
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/video', auth_1.authenticate, upload.single('video'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file provided' });
        }
        const result = await new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload_stream({
                resource_type: 'video',
                folder: 'secondhand-marketplace/videos',
                transformation: [
                    { width: 800, height: 600, crop: 'limit' },
                    { quality: 'auto' }
                ]
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            }).end(req.file.buffer);
        });
        res.json({
            success: true,
            message: 'Video uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/avatar', auth_1.authenticate, upload.single('avatar'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No avatar file provided' });
        }
        const result = await new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload_stream({
                resource_type: 'image',
                folder: 'secondhand-marketplace/avatars',
                transformation: [
                    { width: 200, height: 200, crop: 'fill', gravity: 'face' },
                    { quality: 'auto' }
                ]
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            }).end(req.file.buffer);
        });
        res.json({
            success: true,
            message: 'Avatar uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/document', auth_1.authenticate, upload.single('document'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No document file provided' });
        }
        const result = await new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload_stream({
                resource_type: 'image',
                folder: 'secondhand-marketplace/documents',
                transformation: [
                    { quality: 'auto' }
                ]
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            }).end(req.file.buffer);
        });
        res.json({
            success: true,
            message: 'Document uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id
        });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:publicId', auth_1.authenticate, async (req, res, next) => {
    try {
        const { publicId } = req.params;
        await cloudinary_1.v2.uploader.destroy(publicId);
        res.json({
            success: true,
            message: 'File deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map