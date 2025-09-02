"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const productSchema = joi_1.default.object({
    name: joi_1.default.string().max(200).required(),
    description: joi_1.default.string().max(2000).required(),
    price: joi_1.default.number().min(0).required(),
    category: joi_1.default.string().valid('electronics', 'precious_metals', 'collectibles').required(),
    condition: joi_1.default.string().valid('New', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Vintage', 'Deadstock', 'Near Mint'),
    images: joi_1.default.array().items(joi_1.default.string().uri()).min(1).required(),
    video: joi_1.default.string().uri(),
    location: joi_1.default.object({
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        country: joi_1.default.string().default('India')
    }).required(),
    specifications: joi_1.default.array().items(joi_1.default.string()),
    warranty: joi_1.default.string(),
    brand: joi_1.default.string(),
    model: joi_1.default.string(),
    purity: joi_1.default.string(),
    certification: joi_1.default.string(),
    emergencyFund: joi_1.default.boolean(),
    processingTime: joi_1.default.string(),
    startingBid: joi_1.default.number().min(0),
    auctionEndTime: joi_1.default.date(),
    rarity: joi_1.default.string(),
    tags: joi_1.default.array().items(joi_1.default.string())
});
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 20, category, search, location, minPrice, maxPrice, condition, sortBy = 'createdAt', sortOrder = 'desc', emergencyFund, isAuction } = req.query;
        const filter = { isActive: true };
        if (category)
            filter.category = category;
        if (condition)
            filter.condition = condition;
        if (emergencyFund === 'true')
            filter.emergencyFund = true;
        if (isAuction === 'true')
            filter.isAuction = true;
        if (minPrice || maxPrice) {
            filter.priceValue = {};
            if (minPrice)
                filter.priceValue.$gte = Number(minPrice);
            if (maxPrice)
                filter.priceValue.$lte = Number(maxPrice);
        }
        if (location) {
            filter.$or = [
                { 'location.city': new RegExp(location, 'i') },
                { 'location.state': new RegExp(location, 'i') }
            ];
        }
        if (search) {
            filter.$text = { $search: search };
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const products = await Product_1.default.find(filter)
            .populate('seller', 'username rating isVerified')
            .sort(sort)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Product_1.default.countDocuments(filter);
        res.json({
            success: true,
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product_1.default.findById(req.params.id)
            .populate('seller', 'username rating isVerified location createdAt');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.viewCount += 1;
        await product.save();
        res.json({
            success: true,
            product
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', auth_1.authenticate, async (req, res, next) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const productData = {
            ...req.body,
            seller: req.user._id,
            priceValue: req.body.price
        };
        const product = new Product_1.default(productData);
        await product.save();
        await product.populate('seller', 'username rating isVerified');
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const updatedProduct = await Product_1.default.findByIdAndUpdate(req.params.id, { ...req.body, priceValue: req.body.price }, { new: true, runValidators: true }).populate('seller', 'username rating isVerified');
        res.json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }
        product.isActive = false;
        await product.save();
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/seller/:sellerId', async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const products = await Product_1.default.find({
            seller: req.params.sellerId,
            isActive: true
        })
            .populate('seller', 'username rating isVerified')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Product_1.default.countDocuments({
            seller: req.params.sellerId,
            isActive: true
        });
        res.json({
            success: true,
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/category/:category', async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const category = req.params.category;
        if (!['electronics', 'precious_metals', 'collectibles'].includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        const products = await Product_1.default.find({
            category,
            isActive: true
        })
            .populate('seller', 'username rating isVerified')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Product_1.default.countDocuments({
            category,
            isActive: true
        });
        res.json({
            success: true,
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=products.js.map