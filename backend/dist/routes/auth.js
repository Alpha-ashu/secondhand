"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const registerSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(30).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    firstName: joi_1.default.string().max(50),
    lastName: joi_1.default.string().max(50),
    phone: joi_1.default.string(),
    location: joi_1.default.object({
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        country: joi_1.default.string().default('India')
    })
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ userId }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};
router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password, firstName, lastName, location } = req.body;
        const existingUser = await User_1.default.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }
        const user = new User_1.default({
            username,
            email,
            password,
            firstName,
            lastName,
            location,
            isVerified: false
        });
        await user.save();
        const token = generateToken(user._id.toString());
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location,
                isVerified: user.isVerified
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        const token = generateToken(user._id.toString());
        return res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location,
                isVerified: user.isVerified
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.get('/me', auth_1.authenticate, async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.user._id)
            .populate('favorites', 'name price images category');
        res.json({
            success: true,
            user
        });
    }
    catch (error) {
        next(error);
    }
});
router.put('/profile', auth_1.authenticate, async (req, res, next) => {
    try {
        const updateSchema = joi_1.default.object({
            firstName: joi_1.default.string().max(50),
            lastName: joi_1.default.string().max(50),
            phone: joi_1.default.string(),
            location: joi_1.default.object({
                city: joi_1.default.string(),
                state: joi_1.default.string(),
                country: joi_1.default.string()
            }),
            avatar: joi_1.default.string()
        });
        const { error } = updateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const user = await User_1.default.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/verify', auth_1.authenticate, async (req, res, next) => {
    try {
        const verificationSchema = joi_1.default.object({
            idType: joi_1.default.string().valid('aadhar', 'passport', 'driving_license').required(),
            idNumber: joi_1.default.string().required(),
            documentUrl: joi_1.default.string().uri().required()
        });
        const { error } = verificationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { idType, idNumber, documentUrl } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.user._id, {
            verificationDocuments: {
                idType,
                idNumber,
                documentUrl,
                verificationStatus: 'pending'
            }
        }, { new: true });
        res.json({
            success: true,
            message: 'Verification documents submitted successfully',
            user
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map